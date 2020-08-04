import React from 'react'
import { Form, Input, InputNumber, Modal, message, Select, Row, Col, Radio } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import UploadView from '@/components/upload'
import { If } from '@/packages/common/components'
import SearchFetch from '@/components/search-fetch'
import { formItemLayout } from '@/config'
import { mul } from '@/util/utils'
import { compensateApply, getReasonList, responsibilityList, getRoleAmount, couponList, getUserWxAccount } from '../../api'
const { TextArea } = Input
const { Option } = Select

interface Props extends FormComponentProps {
  modalInfo: any;
  successCb: () => void;
  onCancel: () => void;
  visible: boolean;
}
interface State {
  /* 一级补偿原因 */
  oneReasons: any[]
  /* 责任归属 */
  responsibilityList: any[]
  /* 免费审核额度 */
  quota: number
  wxAccountList: any[]
}

class Compensate extends React.Component<Props, State> {
  state: State = {
    oneReasons: [],
    responsibilityList: [],
    quota: 0,
    wxAccountList: []
  }
  fetchReasons = () => {
    getReasonList().then(oneReasons => {
      this.setState({
        oneReasons
      })
    })
  }
  fetchResponsibilityList = () => {
    responsibilityList().then(responsibilityList => {
      this.setState({
        responsibilityList
      })
    })
  }
  fetchRoleAmount = () => {
    getRoleAmount().then(res => {
      this.setState({
        quota: res.quota
      })
    })
  }
  fetchWxAccount = () => {
    getUserWxAccount({ childOrderCode: '1' }).then(wxAccountList => {
      this.setState({
        wxAccountList
      })
    })
  }
  componentDidMount () {
    this.fetchReasons()
    this.fetchResponsibilityList()
    this.fetchRoleAmount()
    this.fetchWxAccount()
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
      ...values
    }) => {
      if (!errors) {
        values.imgUrl = Array.isArray(values.imgUrl) ? values.imgUrl.map((v: any) => v.url) : []
        values.imgUrl = values.imgUrl.map((urlStr: string) =>
          urlStr.replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', ''))
        if (values.amount) {
          values.amount = mul(values.amount, 100)
        }

        values.reasonType = twoReasonType
        if (compensatePayType === 11) {
          // 喜团账户余额
          values.compensateAmount = APP.fn.formatMoneyNumber(compensateAmount)
        } else if (compensatePayType === 12) {
          // 支付宝转账
          values.receiptorAccountNo = alipayAccount
          values.recepitorAccountName = alipayName
        } else if (compensatePayType === 13) {
          // 微信转账
          const [receiptorAccountNo, recepitorAccountName] = (wxInfo || '').split('|')
          values.receiptorAccountNo = recepitorAccountName
          values.recepitorAccountName = receiptorAccountNo
        } else if (compensatePayType === 14) {
          // 优惠券
          values.couponCode = couponCode
        }

        const res: any = await compensateApply({
          mainOrderCode: modalInfo.orderInfo.orderCode,
          mainOrderId: modalInfo.orderInfo.id,
          childOrderCode: modalInfo.childOrderInfo.orderCode,
          childOrderId: modalInfo.childOrderInfo.id,
          ...values
        })
        if (res.success) {
          message.success('发送补偿成功')
          this.props.successCb()
        }
      }
    })
  };
  render () {
    const {
      modalInfo,
      form: { getFieldDecorator, getFieldValue, setFieldsValue }
    } = this.props
    const { oneReasons, responsibilityList, quota, wxAccountList } = this.state
    const compensatePayType = getFieldValue('compensatePayType')
    const oneReasonType = getFieldValue('oneReasonType')
    const compensateAmount = getFieldValue('compensateAmount')
    let twoReasons = []
    if (oneReasonType !== undefined) {
      twoReasons = oneReasons.find(item => item.reasonType === oneReasonType)?.twoLevelReasonList
    }
    return (
      <Modal
        width={680}
        title='发起补偿'
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleOk}
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
              <Select placeholder='请选择' style={{ width: '100%' }}>
                <Option value={11}>喜团账户余额</Option>
                <Option value={12}>支付宝转账</Option>
                <Option value={13}>微信转账</Option>
                <Option value={14}>优惠券</Option>
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
                        <Option key={item.id} value={item.reasonType}>{item.reasonName}</Option>
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
                  <Select placeholder='请选择' style={{ width: '100%' }}>
                    {
                      twoReasons.map((item: any) => (
                        <Option key={item.id} value={item.reasonType}>{item.reasonName}</Option>
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
                {
                  responsibilityList.map(item => (
                    <Option key={item.responsibilityType} value={item.responsibilityType}>{item.responsibilityName}</Option>
                  ))
                }
              </Select>
            )}
          </Form.Item>
          <If condition={[11, 12, 13].includes(compensatePayType)}>
            <Form.Item label='补偿金额'>
              {getFieldDecorator('compensateAmount', {
                rules: [{ required: compensatePayType === [11, 12, 13].includes(compensatePayType), message: '请输入' }]
              })(
                <InputNumber
                  placeholder='请输入'
                  min={0}
                />
              )}
              <div style={{ lineHeight: '18px', verticalAlign: 'middle', display: 'inline-block' }}>
                <div className='ml10'>
                  当前级别免审核额度：{APP.fn.formatMoney(quota)}
                </div>
                {
                  (compensateAmount && compensateAmount > quota / 100) ? (
                    <div style={{ color: 'red' }} className='ml10'>
                      超出额度，需要客服主管审核！
                    </div>
                  ) : (
                    <div style={{ color: 'green' }} className='ml10'>
                      额度内，无需审核！
                    </div>
                  )
                }
              </div>
            </Form.Item>
          </If>
          <If condition={compensatePayType === 14}>
            <Form.Item label='优惠券选择'>
              {getFieldDecorator('couponCode', {
                rules: [{ required: compensatePayType === 14, message: '请输入' }]
              })(
                <SearchFetch
                  style={{ width: '88px' }}
                  placeholder='请输入优惠券名称'
                  api={(couponName) => {
                    return couponList({ couponName }).then(res => {
                      return res.map((item: any) => ({
                        text: item.couponName,
                        value: item.couponId
                      }))
                    })
                  }}
                />
              )}
              <div style={{ lineHeight: '18px', verticalAlign: 'middle', display: 'inline-block' }}>
                <div className='ml10'>
                当前级别免审核额度：{APP.fn.formatMoney(quota)}
                </div>
                <div className='ml10'>
                超出额度，需要客服主管审核！
                </div>
              </div>
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
                        value={`${item.openId}:${item.memberId}|${item.nickname}`}
                      >
                        {item.nickname}
                      </Radio>
                    ))
                  }
                </Radio.Group>
              )}
            </Form.Item>
          </If>
          <Form.Item label='补偿凭证'>
            {getFieldDecorator('transferEvidenceImg')(
              <UploadView placeholder='请上传' listType='picture-card' listNum={4} size={2} />
            )}
          </Form.Item>
          <Form.Item label='补偿说明'>
            {getFieldDecorator('illustrate')(
              <TextArea />
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
export default Form.create()(Compensate)
