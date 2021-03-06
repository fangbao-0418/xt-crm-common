import React from 'react'
import { Form, Input, InputNumber, Modal, message, Select, Row, Col, Radio } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import UploadView from '@/components/upload'
import { If } from '@/packages/common/components'
import SelectFetch from '@/packages/common/components/select-fetch'
import { formItemLayout } from '@/config'
import { compensateApply, getReasonList, getRoleAmount, getCouponsAllList, getUserWxAccount } from '../../api'
import App from '@/App'
import { AnyCnameRecord } from 'dns'
const { TextArea } = Input
const { Option } = Select

enum CustomerRoleEnums {
  '普通客服' = 1,
  '客服组长' = 2,
  '客服主管' = 3,
  '客服经理' = 4,
}

interface Props extends FormComponentProps {
  modalInfo: any;
  successCb: () => void;
  onCancel: () => void;
  visible: boolean;
  orderBizType: number
}
interface State {
  /* 一级补偿原因 */
  oneReasons: any[]
  /* 免费审核额度 */
  quota: number
  /* 不同等级的审核值 */
  roleQuotas: any[]
  /* 客服等级 */
  roleType: number
  wxAccountList: any[]
  /* 微信选项是否禁用 */
  wxDisable: boolean
}

class Compensate extends React.Component<Props, State> {
  couponCodeList: any = []
  state: State = {
    oneReasons: [],
    quota: 0,
    roleQuotas: [],
    wxAccountList: [],
    wxDisable: false,
    roleType: 0
  }
  fetchReasons = () => {
    getReasonList().then((oneReasons: any[]) => {
      this.setState({
        oneReasons: oneReasons || []
      })
    })
  }
  fetchRoleAmount = () => {
    getRoleAmount().then((res: any) => {
      this.setState({
        quota: res?.quota,
        roleQuotas: (res?.roleQuotas || []).filter((item: any) => item.orderBizType === 0),
        roleType: res?.roleType
      })
    })
  }
  fetchWxAccount = () => {
    const { modalInfo } = this.props
    getUserWxAccount({ childOrderCode: modalInfo.childOrderInfo.orderCode }).then((wxAccountList: any[]) => {
      this.setState({
        wxAccountList: wxAccountList || [],
        wxDisable: (wxAccountList || []).length === 0
      })
    })
  }
  componentDidMount () {
    this.fetchReasons()
    this.fetchRoleAmount()
    this.fetchWxAccount()
  }
  handleAfterClose = () => {
    const {
      form: { resetFields }
    } = this.props
    resetFields()
  }
  handleOk = () => {
    const {
      form: { validateFields },
      modalInfo
    } = this.props
    validateFields(async (errors, {
      compensatePayType,
      oneReasonType,
      twoReasonType,
      compensateAmount,
      alipayName,
      alipayAccount,
      couponCode,
      wxInfo,
      transferEvidenceImgs,
      ...values
    }) => {
      if (!errors) {
        transferEvidenceImgs = Array.isArray(transferEvidenceImgs) ? transferEvidenceImgs.map((v: any) => v.url) : []
        transferEvidenceImgs = transferEvidenceImgs.map((urlStr: string) => APP.fn.deleteOssDomainUrl(urlStr))
        values.transferEvidenceImgs = transferEvidenceImgs

        values.reasonType = twoReasonType
        if (compensatePayType === 11) {
          // 喜团账户余额
          values.compensateAmount = APP.fn.formatMoneyNumber(compensateAmount)
        } else if (compensatePayType === 12) {
          // 支付宝转账
          values.receiptorAccountNo = alipayAccount
          values.receiptorAccountName = alipayName
          values.compensateAmount = APP.fn.formatMoneyNumber(compensateAmount)
        } else if (compensatePayType === 13) {
          // 微信转账
          const [receiptorAccountNo, receiptorAccountName] = (wxInfo || '').split('|')
          values.receiptorAccountNo = receiptorAccountNo
          values.receiptorAccountName = receiptorAccountName
          values.compensateAmount = APP.fn.formatMoneyNumber(compensateAmount)
        } else if (compensatePayType === 10) {
          // 优惠券
          values.couponCode = couponCode
        }

        const res: any = await compensateApply({
          mainOrderCode: modalInfo.orderInfo.orderCode,
          mainOrderId: modalInfo.orderInfo.id,
          childOrderCode: modalInfo.childOrderInfo.orderCode,
          childOrderId: modalInfo.childOrderInfo.id,
          compensatePayType,
          ...values
        })
        if (res) {
          message.success('申请成功')
          this.props.successCb()
        }
      }
    })
  };
  getAuditMsg = (amount: number = 0) => {
    amount = amount * 100
    const { roleQuotas, roleType } = this.state
    const quotas = roleQuotas.map(item => item.quota).sort((x, y) => y - x)
    const curentRoleQuota = roleQuotas.find(item => item.roleType === roleType)
    const max = Math.max(...quotas)
    if (amount <= curentRoleQuota?.quota) {
      return (
        <div style={{ color: 'green' }} className='ml10'>额度内，无需审核</div>
      )
    }
    if (amount > max) {
      return (
        <div style={{ color: 'red' }} className='ml10'>
          超出最大审核限制{APP.fn.formatMoney(max)}
        </div>
      )
    }
    const l = quotas.length
    for (let i = 0; i < l; i++) {
      const cur = quotas[i]
      if (amount > cur) {
        // const curItem = roleQuotas.find(item => item.quota === cur)
        const nextItem = roleQuotas.find(item => item.quota === quotas[i - 1])
        return (
          <div style={{ color: 'red' }} className='ml10'>超出额度，需要{CustomerRoleEnums[nextItem?.roleType]}审核！</div>
        )
      } else {
        continue
      }
    }
  }
  handleTwoReasonType = (value: any, select: any) => {
    const { oneReasons } = this.state
    const { form: { setFieldsValue } } = this.props
    const [oneId, twoId] = select.key.split('|')
    const curTwolist = oneReasons.find((item: any) => item.id === +oneId)?.twoLevelReasonList || []
    const twoObj = curTwolist.find((item: any) => item.id === +twoId)
    console.log([oneId, twoId], curTwolist, twoObj, oneReasons)
    setFieldsValue({
      responsibilityType: twoObj?.responsibilityType
    })
  }
  handleCompensatePayTypeChange = (value: any) => {
    if (value === 13) {
      if (this.state.wxAccountList.length) {
        const item = this.state.wxAccountList[0]
        setTimeout(() => {
          this.props.form.setFieldsValue({
            wxInfo: item ? `${item.appId}:${item.openId}|${item.nickname}` : undefined
          })
        })
      }
    }
  }
  render () {
    const {
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      orderBizType
    } = this.props
    const { oneReasons, quota, wxAccountList, wxDisable } = this.state
    const compensatePayType = getFieldValue('compensatePayType')
    const oneReasonType = getFieldValue('oneReasonType')
    const compensateAmount = getFieldValue('compensateAmount')
    const couponCode = getFieldValue('couponCode')
    let twoReasons = []
    if (oneReasonType !== undefined) {
      twoReasons = oneReasons.find(item => item.reasonType === oneReasonType)?.twoLevelReasonList
    }

    let couponMoneny = 0

    if (couponCode && this.couponCodeList.length) {
      const faceValue = this.couponCodeList.find((item: any) => item.code === couponCode)?.faceValue
      couponMoneny = faceValue?.split(':')?.[1]
    }

    return (
      <Modal
        width={680}
        title='发起补偿'
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleOk}
        afterClose={this.handleAfterClose}
      >
        <Form {...formItemLayout}>
          <Form.Item label='补偿方式'>
            {getFieldDecorator('compensatePayType', {
              rules: [
                {
                  required: true,
                  message: '请选择'
                }
              ]
            })(
              <Select onChange={this.handleCompensatePayTypeChange} placeholder='请选择' style={{ width: '100%' }}>
                {orderBizType !== 30 && <Option value={11}>喜团账户余额</Option>}
                <Option value={12}>支付宝转账</Option>
                <Option disabled={wxDisable} value={13}>微信转账</Option>
                {orderBizType !== 30 && <Option value={10}>优惠券</Option>}
              </Select>
            )}
          </Form.Item>
          <Form.Item label='补偿原因'>
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('oneReasonType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择'
                    }
                  ]
                })(
                  <Select
                    onChange={() => {
                      setFieldsValue({
                        twoReasonType: undefined
                      })
                    }}
                    placeholder='请选择'
                    style={{ width: '100%' }}
                  >
                    {
                      oneReasons.map(item => (
                        <Option key={item.parentId + '|' + item.id} value={item.reasonType}>{item.reasonName}</Option>
                      ))
                    }
                  </Select>
                )}
              </Col>
              <Col span={12}>
                {getFieldDecorator('twoReasonType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择'
                    }
                  ]
                })(
                  <Select onChange={this.handleTwoReasonType} placeholder='请选择' style={{ width: '100%' }}>
                    {
                      twoReasons.map((item: any) => (
                        <Option key={item.parentId + '|' + item.id} value={item.reasonType}>{item.reasonName}</Option>
                      ))
                    }
                  </Select>
                )}
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label='责任归属'>
            {getFieldDecorator('responsibilityType', {
              rules: [{ required: true, message: '请填写' }]
            })(
              <Select placeholder='请选择' style={{ width: '100%' }}>
                <Option value={10}>商家</Option>
                <Option value={20}>平台</Option>
                <Option value={30}>仓配</Option>
                <Option value={40}>客服</Option>
              </Select>
            )}
          </Form.Item>
          <If condition={[11, 12, 13].includes(compensatePayType)}>
            <Form.Item label='补偿金额'>
              {getFieldDecorator('compensateAmount', {
                rules: [{ required: [11, 12, 13].includes(compensatePayType), message: '请输入' }]
              })(
                <InputNumber
                  placeholder='请输入'
                  min={0.01}
                />
              )}
              <div style={{ lineHeight: '18px', verticalAlign: 'middle', display: 'inline-block' }}>
                <div className='ml10'>
                  当前级别免审核额度：{APP.fn.formatMoney(quota)}
                </div>
                { this.getAuditMsg(compensateAmount) }
              </div>
            </Form.Item>
          </If>
          <If condition={compensatePayType === 10}>
            <Form.Item label='优惠券选择' extra={
              <>
                <div style={{ lineHeight: '18px', verticalAlign: 'middle', display: 'inline-block' }}>
                  <div className='ml10'>
                当前级别免审核额度：{APP.fn.formatMoney(quota)}
                  </div>
                  { this.getAuditMsg(couponMoneny / 100) }
                </div>
              </>
            }>
              {getFieldDecorator('couponCode', {
                rules: [{ required: compensatePayType === 10, message: '请输入' }]
              })(
                <SelectFetch
                  showSearch
                  style={{ width: '100%' }}
                  optionFilterProp='children'
                  filterOption={(input, option) => {
                    return (option.props.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }}
                  placeholder='请选择'
                  fetchData={() => {
                    return getCouponsAllList({ orderBizType: 0 }).then((res: any) => {
                      this.couponCodeList = res || []
                      return (res || []).map((item: any) => {
                        const result = item.faceValue.split(':')
                        return {
                          label: `${item.name}, 满${(result[0] / 100) || 0}减${(result[1] / 100) || 0}, ${item.code}`,
                          value: item.code
                        }
                      })
                    })
                  }}
                />
              )}
            </Form.Item>
          </If>
          <If condition={compensatePayType === 12}>
            <>
              <Form.Item label='支付宝姓名'>
                {getFieldDecorator('alipayName', {
                  rules: [{ required: compensatePayType === 12, message: '请输入' }]
                })(
                  <Input placeholder='请输入' />
                )}
              </Form.Item>
              <Form.Item label='支付宝账号'>
                {getFieldDecorator('alipayAccount', {
                  rules: [{ required: compensatePayType === 12, message: '请输入' }]
                })(
                  <Input placeholder='请输入' />
                )}
              </Form.Item>
            </>
          </If>
          <If condition={compensatePayType === 13}>
            <Form.Item label='微信帐号'>
              {getFieldDecorator('wxInfo', {
                rules: [{ required: compensatePayType === 13, message: '请输入' }]
              })(
                <Radio.Group>
                  {
                    wxAccountList.map(item => (
                      <Radio
                        key={item.memberId}
                        style={{
                          display: 'block',
                          height: '30px',
                          lineHeight: '30px'
                        }}
                        value={`${item.appId}:${item.openId}|${item.nickname}`}
                      >
                        {item.nickname}
                      </Radio>
                    ))
                  }
                </Radio.Group>
              )}
            </Form.Item>
          </If>
          <Form.Item label='补偿凭证' extra='最多上传3张图片, 大小不能超过2M'>
            {getFieldDecorator('transferEvidenceImgs', {
              rules: [{ required: true, message: '请上传图片' }]
            })(
              <UploadView placeholder='请上传' listType='picture-card' listNum={3} size={2} />
            )}
          </Form.Item>
          <Form.Item label='补偿说明' extra='最多不超过200个字'>
            {getFieldDecorator('illustrate')(
              <TextArea maxLength={200} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
export default Form.create()(Compensate)
