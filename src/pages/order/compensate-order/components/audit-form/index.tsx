import React from 'react'
import { Radio } from 'antd'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import SelectFetch from '@/packages/common/components/select-fetch'
import UploadView from '@/components/upload'
import { getFieldsConfig } from './config'
import { CompensatePayTypeEnum } from '../../config'
import { initImgList } from '@/util/utils'
import { If } from '@/packages/common/components'
import * as api from '../../api'

enum CustomerRoleEnums {
  '普通客服' = 1,
  '客服组长' = 2,
  '客服主管' = 3,
  '客服经理' = 4,
}

interface Props {
  getInstance?: (ref: any) => void
  detail: any
  /* 微信账号选择列表 */
  wxAccountList: any[]
  /* 免费审核额度 */
  quota: number
  /* 不同等级的审核值 */
  roleQuotas: any[]
  /* 客服等级 */
  roleType: number
}

class Main extends React.Component<Props> {
  form: FormInstance
  state = {
    compensateAmount: this.props.detail.compensateAmount / 100,
    couponCode: this.props.detail.couponCode,
    readonly: false
  }
  couponCodeList: any = []
  componentWillMount () {
    if (this.props.getInstance) {
      this.props.getInstance(this)
    }
  }
  componentDidMount () {
    this.initData()
  }
  initData = () => {
    const { detail } = this.props
    this.form.setValues({
      responsibilityType: detail.responsibilityType,
      compensateAmount: detail.compensateAmount / 100,
      memberId: detail.memberId,
      transferEvidenceImgs: (detail.transferEvidenceImg ? JSON.parse(detail.transferEvidenceImg) : []).map((item: any) => initImgList(item)[0]),
      illustrate: detail.illustrate,
      receiptorAccountName: detail.receiptorAccountName,
      receiptorAccountNo: detail.receiptorAccountNo,
      couponCode: detail.couponCode
    })
  }
  getAuditMsg = (amount: number = 0) => {
    amount = amount * 100
    const { roleQuotas, roleType } = this.props
    const quotas = roleQuotas.map(item => item.quota).sort((x, y) => y - x)
    const curentRoleQuota = roleQuotas.find(item => item.roleType === roleType)
    const max = Math.max(...quotas)
    if (amount <= curentRoleQuota?.quota) {
      return (
        <div style={{ color: 'green' }}>额度内，无需审核</div>
      )
    }
    if (amount > max) {
      return (
        <div style={{ color: 'red' }}>
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
          <div style={{ color: 'red' }}>超出额度，需要{CustomerRoleEnums[nextItem?.roleType]}审核！</div>
        )
      } else {
        continue
      }
    }
  }
  render () {
    const { detail, wxAccountList, quota } = this.props
    const { compensateAmount, couponCode, readonly } = this.state
    let couponMoneny = 0

    if (couponCode && this.couponCodeList.length) {
      const faceValue = this.couponCodeList.find((item: any) => item.code === couponCode)?.faceValue
      couponMoneny = faceValue?.split(':')?.[1]
    }
    return (
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        config={getFieldsConfig()}
        getInstance={(ref) => {
          this.form = ref
        }}
      >
        <FormItem
          verifiable
          name='operateType'
          controlProps={{
            onChange: (e: any) => {
              this.setState({
                readonly: e.target.value === 2
              }, () => {
                this.initData()
              })
            }
          }}
        />
        <If condition={!readonly}>
          <FormItem readonly={readonly} verifiable required name='responsibilityType' />
          <If
            condition={[
              CompensatePayTypeEnum['喜团账户余额'],
              CompensatePayTypeEnum['支付宝转账'],
              CompensatePayTypeEnum['微信转账']
            ].includes(detail.compensatePayType)}
          >
            <>
              <FormItem
                controlProps={{
                  onChange: (compensateAmount: any) => {
                    this.setState({
                      compensateAmount
                    })
                  }
                }}
                verifiable
                readonly={readonly}
                name='compensateAmount'
              />
              <FormItem style={{ margin: '-24px 0 0' }}>
                <div style={{ lineHeight: '20px', paddingBottom: 16 }}>
                  <div>当前级别免审核额度：{APP.fn.formatMoney(quota)}</div>
                  <div>{this.getAuditMsg(compensateAmount)}</div>
                </div>
              </FormItem>
            </>
          </If>
          <If
            condition={[
              CompensatePayTypeEnum['优惠券']
            ].includes(detail.compensatePayType)}
          >
            <>
              <FormItem
                required
                label='优惠券'
                inner={(form) =>{
                  return form.getFieldDecorator('couponCode', {
                    rules: [{ required: !readonly, message: '请输入' }]
                  })(
                    <SelectFetch
                      readonly={readonly}
                      allowClear={false}
                      showSearch
                      style={{ width: '100%' }}
                      optionFilterProp='children'
                      filterOption={(input, option) => {
                        return (option.props.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}
                      onChange={couponCode => {
                        this.setState({
                          couponCode
                        })
                      }}
                      placeholder='请选择'
                      fetchData={() => {
                        return api.getCouponsAllList({ orderBizType: 0 }).then((res: any) => {
                          this.couponCodeList = res || []
                          return (res || []).map((item: any) => {
                            const result = item.faceValue.split(':')
                            return {
                              label: `满${(result[0] / 100) || 0}减${(result[1] / 100) || 0}`,
                              value: item.code
                            }
                          })
                        })
                      }}
                    />
                  )
                }}
              />
              <FormItem style={{ margin: '-24px 0 0' }}>
                <div style={{ lineHeight: '20px', paddingBottom: 16 }}>
                  <div>当前级别免审核额度：{APP.fn.formatMoney(quota)}</div>
                  <div>{this.getAuditMsg(couponMoneny / 100)}</div>
                </div>
              </FormItem>
            </>
          </If>
          <If
            condition={[
              CompensatePayTypeEnum['支付宝转账']
            ].includes(detail.compensatePayType)}
          >
            <>
              <FormItem label='转账方式'>支付宝转账</FormItem>
              <FormItem readonly={readonly} verifiable name='receiptorAccountName' />
              <FormItem readonly={readonly} verifiable name='receiptorAccountNo' />
            </>
          </If>
          <If
            condition={[
              CompensatePayTypeEnum['微信转账']
            ].includes(detail.compensatePayType)}
          >
            <>
              <FormItem label='转账方式'>微信转账</FormItem>
              <FormItem
                required
                label='微信账号'
                inner={(form) => {
                  return form.getFieldDecorator('memberId', {
                    rules: [
                      {
                        required: !readonly,
                        message: '请选择'
                      }
                    ]
                  })(
                    <Radio.Group
                      disabled={readonly}
                    >
                      {
                        wxAccountList.map(item => (
                          <Radio
                            key={item.memberId}
                            style={{
                              display: 'block',
                              height: '30px',
                              lineHeight: '30px'
                            }}
                            value={item.memberId}
                          >
                            {item.nickname}
                          </Radio>
                        ))
                      }
                    </Radio.Group>
                  )
                }}
              />
            </>
          </If>
          <FormItem
            label='补偿凭证'
            required={!readonly}
            inner={(form) => {
              return form.getFieldDecorator('transferEvidenceImgs', {
                rules: [
                  {
                    required: !readonly,
                    message: '请上传补偿凭证'
                  }
                ]
              })(
                <UploadView
                  disabled={readonly}
                  ossType='cos'
                  placeholder='请上传'
                  listType='picture-card'
                  listNum={3}
                  size={2}
                />
              )
            }}
          />
        </If>
        <FormItem name='remarks' />
      </Form>
    )
  }
}

export default Main