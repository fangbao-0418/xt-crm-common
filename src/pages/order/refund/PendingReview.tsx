import React from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Row,
  message,
  Radio
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import {
  withRouter,
  RouteComponentProps
} from 'react-router'
import { connect } from 'react-redux'
import { refundType, customerFollowType } from '@/enum'
import { XtSelect } from '@/components'
import { formatPrice, formatRMB } from '@/util/format'
import ReturnShippingSelect from '../components/ReturnShippingSelect'
import ReturnCouponSelect from '../components/ReturnCouponSelect'
import AfterSaleSelect from '../components/after-sale-select'
import ModifyShippingAddress from '../components/modal/ModifyShippingAddress'
import AfterSaleDetailTitle from './components/AfterSaleDetailTitle'
import {
  enumRefundType,
  enumRefundStatus
} from '../constant'
import { namespace } from './model'
import {
  formItemLayout,
  formLeftButtonLayout
} from '@/config'
import AfterSaleApplyInfo from './components/AfterSaleApplyInfo'
import ModifyReturnAddress from '../components/modal/ModifyReturnAddress'
import { mul } from '@/util/utils'
import { verifyDownDgrade, getOrderRefundQuickReply, checkRefundCoupon } from './../api'
import { OptionProps } from 'antd/lib/select'
import { Decimal } from 'decimal.js'
const { Option } = Select
interface Props
  extends FormComponentProps,
    RouteComponentProps<{ id: any }> {
  data: AfterSalesInfo.data
}
interface State {
  addressVisible: boolean
  selectedValues: any[]
  isDemotion: number
  demotionInfo: string
  secondRefund?: string
  firstLevel: OptionProps[],
  secondLevel: OptionProps[]
  refundTypeValue: any
  deductionAmount?: number
}

class PendingReview extends React.Component<Props, State> {
  refundQuickReply: any;
  secondRefundQuickReply: any;
  state: State = {
    addressVisible: false,
    selectedValues: [],
    isDemotion: this.checkVO.isDemotion,
    demotionInfo: '',
    secondRefund: '',
    firstLevel: [],
    secondLevel: [],
    refundTypeValue: undefined
  }

  componentDidMount () {
    this.checkRefundCoupon({
      childOrderId: this.orderInfoVO.childOrderId,
      refundNum: this.checkVO.serverNum,
      refundAmount: this.checkVO.refundAmount,
      refundType: this.checkVO.refundType
    })
    getOrderRefundQuickReply().then((res: any) => {
      res = res || {}
      const firstLevel = Object.keys(res).map((str) => ({ label: str, value: str }))
      console.log('firstLevel', firstLevel)
      this.refundQuickReply = res
      this.setState({ firstLevel })
    })
  }

  /* 校验满赠优惠券金额 */
  checkRefundCoupon = (data: { childOrderId: number, refundNum: number, refundAmount: number, refundType: number }, cb?: () => void) => {
    checkRefundCoupon(data).then((res: any) => {
      console.log(res, 'res 92')
      if (res) {
        this.setState({
          deductionAmount: res.deductionAmount
        }, () => {
          if (cb) {
            cb()
          }
        })
      } else {
        if (cb) {
          cb()
        }
      }
    })
  }

  /**
   * 客服审核
   * @param status {number} 0:拒绝,1:同意
   */
  handleAuditOperate = (status: number) => {
    this.props.form.validateFields((errors, values) => {
      // return
      if (!errors) {
        if (status === 1 && values.serverNum == 0) {
          message.error('售后数目必须大于0')
          return
        }
        if (typeof values.info === 'string' && values.info.indexOf('{}') !== -1) {
          message.error('说明请替换{}内容')
          return
        }
        if (values.refundAmount) {
          values.refundAmount = mul(
            values.refundAmount,
            100
          )
        }
        if (values.isRefundFreight === undefined) {
          values.isRefundFreight = this.props.data.checkVO.isRefundFreight
        }
        if (!this.isReturnShipping) {
          values.isRefundFreight = 0
        }
        // return
        const payload = {
          id: +this.props.match.params.id,
          status,
          ...values
        }
        const checkVO = Object.assign(
          {},
          this.props.data.checkVO
        )
        const orderServerVO = Object.assign(
          {},
          this.props.data.orderServerVO
        )
        if (status === 1) {
          payload.returnContact = checkVO.returnContact
          payload.returnPhone = checkVO.returnPhone
          payload.returnAddress = checkVO.returnAddress
          payload.contactVO = orderServerVO.contactVO
        }
        console.log(payload, values, 'payload 157')
        APP.dispatch({
          type: `${namespace}/auditOperate`,
          payload
        })
      }
    })
  }
  /**
   * 输入框输入的售后数目
   */
  get serverNum (): number {
    return this.props.form.getFieldValue('serverNum')
  }
  /**
   * 审核信息对象
   */
  get checkVO () {
    return Object.assign({}, this.props.data.checkVO)
  }
  /**
   * 售后单价
   */
  get unitPrice (): number {
    return this.checkVO.unitPrice || 0
  }
  /**
   * 根据售后数目计算退款金额
   */
  get relatedAmount (): number {
    const result = mul(this.unitPrice, this.serverNum)
    return Math.min(result, this.checkVO.maxRefundAmount)
  }
  /**
   * 输入框输入的售后金额
   */
  get refundAmount (): number {
    const result = this.props.form.getFieldValue(
      'refundAmount'
    )
    console.log(result, 'result 197')
    // return result
    return mul(Number(result || 0), 100)
  }
  /**
   * 最终售后金额
   */
  get maxRefundAmount (): number {
    const refundCouponAmount = this.props.form.getFieldValue('refundCouponAmount')
    let maxRefundAmount
      = this.serverNum === this.checkVO.maxServerNum
        ? this.checkVO.maxRefundAmount
        : this.relatedAmount
    if (refundCouponAmount === 1) {
      maxRefundAmount = new Decimal(maxRefundAmount).sub(new Decimal(this.state.deductionAmount || 0)).toNumber()
    }
    console.log(maxRefundAmount, 'maxRefundAmount')
    if (maxRefundAmount < 0) {
      maxRefundAmount = 0
    }
    return maxRefundAmount
  }
  /**
   * 运费是否大于0
   */
  get hasFreight (): boolean {
    return this.checkVO.freight > 0
  }
  /**
   * 是否退运费
   * @param 退款金额
   * @param alreadyRefundAmount 已经退款金额
   * @param freight 运费
   */
  get isReturnShipping (): boolean {
    console.log(this.refundAmount, this.checkVO.maxRefundAmount, this.checkVO.serverNum, this.serverNum, 229)
    const result
      = this.refundAmount === this.checkVO.maxRefundAmount
      && this.checkVO.serverNum === this.serverNum
    // let result = this.refundAmount + this.orderServerVO.alreadyRefundAmount + this.checkVO.freight === this.orderInfoVO.payMoney;
    return (
      this.hasFreight
      && this.checkVO.isRefundFreight === 1
      && result
    )
  }
  /**
   * 获取售后类型
   * @returns {string|*}
   */
  get refundType (): number {
    return this.props.form.getFieldValue('refundType')
  }
  /**
   * 售后申请信息对象
   */
  get orderServerVO (): AfterSalesInfo.OrderServerVO {
    return Object.assign({}, this.props.data.orderServerVO)
  }
  /**
   * 订单信息对象
   */
  get orderInfoVO (): AfterSalesInfo.OrderInfoVO {
    return Object.assign({}, this.props.data.orderInfoVO)
  }
  /**
   * 联系方式对象
   */
  get contactVO () {
    return this.orderServerVO.contactVO || {}
  }
  /**
   * 校验售后类型
   * @param refundType
   */
  isRefundTypeOf (refundType: number) {
    return this.refundType === refundType
  }
  /**
   * 校验售后状态
   * @param refundStatus
   */
  isRefundStatusOf (refundStatus: number) {
    return this.orderServerVO.refundStatus === refundStatus
  }
  /**
   * 修改退货地址
   */
  handleChangeReturnAddress = (values: any) => {
    APP.dispatch({
      type: `${namespace}/saveDefault`,
      payload: {
        data: {
          ...this.props.data,
          checkVO: Object.assign(
            this.props.data.checkVO,
            values
          )
        }
      }
    })
  }
  /**
   * 修改收货地址
   */
  handleChangeShippingAddress = (values: any) => {
    const { returnContact, returnPhone, ...rest } = values
    APP.dispatch({
      type: `${namespace}/saveDefault`,
      payload: {
        data: {
          ...this.props.data,
          orderServerVO: {
            ...this.orderServerVO,
            contactVO: {
              ...this.contactVO,
              ...rest,
              contact: returnContact,
              phone: returnPhone
            }
          }
        }
      }
    })
  }
  /**
   * 验证是否会降级
   */
  verifyMaxRefundAmount = (value: number) => {
    console.log('最终退款金额', value)
    console.log(
      'verifyMaxRefundAmount',
      this.props.data.orderInfoVO
    )
    verifyDownDgrade({
      orderMainId: this.props.data.orderInfoVO.mainOrderId,
      refundType: this.refundType,
      amount: value
    }).then((res: any) => {
      console.log('verifyMaxRefundAmount', res)
      this.setState({
        isDemotion: res ? 1 : 0 //true会降级
      })
    })
  }
  /**
   * 修改售后数目
   */
  handleChangeServerNum = (value: any = 0) => {
    const result = mul(this.unitPrice, value)
    this.checkRefundCoupon({
      childOrderId: this.orderInfoVO.childOrderId,
      refundNum: value,
      refundAmount: this.checkVO.refundAmount,
      refundType: this.checkVO.refundType
    }, () => {
      console.log(result, this.maxRefundAmount, 354)
      const refundAmount = result > this.maxRefundAmount ? formatPrice(this.maxRefundAmount) : formatPrice(result)
      this.props.form.setFieldsValue(
        {
          refundAmount
        },
        () => {
          this.verifyMaxRefundAmount(refundAmount)
        }
      )
    })
  }
  /**
   * 降级改变
   */
  onChangeJiangji = (e: any) => {
    console.log('onChangeJiangji', e)
    this.setState({
      isDemotion: e.target.value
    })
  }
  /**
   * 退款金额变动
   */
  handleChangeMaxRefundAmount = (value: number = 0) => {
    this.checkRefundCoupon({
      childOrderId: this.orderInfoVO.childOrderId,
      refundNum: this.serverNum,
      refundAmount: value * 100,
      refundType: this.checkVO.refundType
    }, () => {
      this.verifyMaxRefundAmount(value * 100)
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { deductionAmount } = this.state
    let { refundTypeValue } = this.state
    const { orderInterceptRecordVO, shopDTO } = this.props
      .data as any
    const isHaiTao
      = Number(this.orderInfoVO.orderType) === 70
    const isXiaoDian = shopDTO && shopDTO.shopType === 2
    const options = refundType.getArray()
    /** 海淘订单请选择售后类型没有换货 */
    const refundTypeOptions = isHaiTao
      ? options.filter((v) => v.key !== 30)
      : options
    refundTypeValue = refundTypeValue || this.checkVO.refundType
    console.log('refundTypeValue', refundTypeValue, typeof refundTypeValue, this.checkVO)
    return (
      <div>
        <Card title={<AfterSaleDetailTitle />}>
          <AfterSaleApplyInfo
            shopDTO={shopDTO}
            orderServerVO={this.orderServerVO}
            orderInterceptRecordVO={orderInterceptRecordVO}
          />
        </Card>
        <Card title='客服审核'>
          <Form
            {...formItemLayout}
            style={{ width: '80%' }}
          >
            <Form.Item label='售后类型'>
              {getFieldDecorator('refundType', {
                initialValue: this.checkVO.refundType,
                rules: [
                  {
                    required: true,
                    message: '请选择售后类型'
                  }
                ]
              })(
                <XtSelect
                  style={{ width: 200 }}
                  data={refundTypeOptions}
                  placeholder='请选择售后类型'
                  onChange={(refundTypeValue: any) => {
                    this.setState({
                      refundTypeValue
                    }, () => {
                      const serverNum = this.props.form.getFieldValue('serverNum')
                      const fields: any = {
                        returnReason: undefined
                      }
                      if (serverNum !== undefined) {
                        const maxRefundAmount = formatPrice(this.maxRefundAmount)
                        const calcAmount = formatPrice(this.unitPrice * serverNum)
                        fields.refundAmount = calcAmount > maxRefundAmount ? maxRefundAmount : calcAmount
                      }
                      this.props.form.setFieldsValue(fields)
                    })
                  }}
                />
              )}
            </Form.Item>
            <Form.Item label='售后原因'>
              {getFieldDecorator('returnReason', {
                initialValue: this.orderServerVO
                  .returnReason,
                rules: [
                  {
                    required: true,
                    message: '请选择售后原因'
                  }
                ]
              })(
                <AfterSaleSelect
                  refundType={this.refundType}
                />
              )}
            </Form.Item>
            {(refundTypeValue === enumRefundType.Refund) && (
              <Form.Item label='是否需要客服跟进'>
                {getFieldDecorator('isCustomerFollow', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '请选择是否需要客服跟进'
                    }
                  ]
                })(
                  <XtSelect
                    data={customerFollowType.getArray()}
                    style={{ width: 200 }}
                  />
                )}
              </Form.Item>
            )}
            <Row>
              <Form.Item label='售后数目'>
                {getFieldDecorator('serverNum', {
                  initialValue: this.checkVO.serverNum,
                  rules: [
                    {
                      required: true,
                      message: '请输入售后数目'
                    }
                  ]
                })(
                  <InputNumber
                    className='not-has-handler'
                    min={0}
                    max={this.checkVO.maxServerNum}
                    placeholder='请输入'
                    onChange={this.handleChangeServerNum}
                  />
                )}
                <span>
                  （最多可售后数目：{this.checkVO.maxServerNum}）
                </span>
              </Form.Item>
            </Row>
            {this.isReturnShipping && (
              <Form.Item label='退运费'>
                {getFieldDecorator('isRefundFreight', {
                  initialValue: this.checkVO.isRefundFreight
                })(
                  <ReturnShippingSelect
                    checkVO={this.checkVO}
                  />
                )}
              </Form.Item>
            )}
            {(refundTypeValue !== enumRefundType.Refund) && (
              <Form.Item label='退货地址'>
                <ModifyReturnAddress
                  detail={this.checkVO}
                  intercept={orderInterceptRecordVO}
                  onSuccess={this.handleChangeReturnAddress}
                />
              </Form.Item>
            )}
            {(refundTypeValue === enumRefundType.Exchange) && (
              <Form.Item label='用户收货地址'>
                <ModifyShippingAddress
                  detail={{
                    ...this.contactVO,
                    returnContact: this.contactVO.contact,
                    returnPhone: this.contactVO.phone
                  }}
                  onSuccess={
                    this.handleChangeShippingAddress
                  }
                />
              </Form.Item>
            )}
            {
              deductionAmount && (
                <Form.Item label='是否回收优惠券金额'>
                  {getFieldDecorator('refundCouponAmount', {
                    rules: [
                      {
                        required: true,
                        message: '请选择'
                      }
                    ]
                  })(
                    <ReturnCouponSelect
                      deductionAmount={deductionAmount}
                      onChange={() => {
                        let timer = 0
                        clearTimeout(timer)
                        timer = setTimeout(() => {
                          console.log(this.maxRefundAmount, 557)
                          this.props.form.setFieldsValue({
                            refundAmount: formatPrice(this.maxRefundAmount)
                          })
                        })
                      }}
                    />
                  )}
                </Form.Item>
              )
            }
            {(refundTypeValue !== enumRefundType.Exchange) && (
              <Form.Item label='退款金额'>
                {getFieldDecorator('refundAmount', {
                  initialValue: formatPrice(
                    this.checkVO.refundAmount
                  ),
                  rules: [
                    {
                      required: true,
                      message: '请输入退款金额'
                    }
                  ]
                })(
                  <InputNumber
                    disabled={isHaiTao || isXiaoDian}
                    min={0}
                    max={formatPrice(this.maxRefundAmount)}
                    formatter={formatRMB}
                    onChange={
                      this.handleChangeMaxRefundAmount
                    }
                  />
                )}
                <span>
                  （最多可退￥{`${formatPrice(
                    this.maxRefundAmount
                  )}${isHaiTao ? '，已包含税费' : ''}`}）
                </span>
              </Form.Item>
            )}
            <Form.Item label='快捷说明'>
              <Select
                placeholder='请选择一级'
                onChange={(key: string) => {
                  this.secondRefundQuickReply = this.refundQuickReply[key] || {}
                  const secondLevel = Object.keys(this.secondRefundQuickReply).map((str: string) => ({ label: str, value: str }))
                  this.setState({
                    secondRefund: undefined,
                    secondLevel
                  })
                }}
              >
                {this.state.firstLevel.map((item: OptionProps) => (
                  <Option key={item.value} value={item.value}>{ item.label }</Option>
                ))}
              </Select>
              <Select
                placeholder='请选择二级'
                value={this.state.secondRefund}
                onChange={(key: string) => {
                  this.setState({ secondRefund: key })
                  const info = this.secondRefundQuickReply[key]
                  this.props.form.setFieldsValue({ info })
                }}
              >
                {this.state.secondLevel.map((item: OptionProps) => (
                  <Option key={item.value} value={item.value}>{ item.label }</Option>
                ))}
              </Select>
            </Form.Item>
            <Row>
              <Form.Item label='说明'>
                {getFieldDecorator('info', {})(
                  <Input.TextArea
                    autoSize={{ minRows: 2, maxRows: 6 }}
                  />
                )}
              </Form.Item>
            </Row>
            {this.state.isDemotion > 0 && (
              <Row>
                <Form.Item label='团长降级'>
                  {getFieldDecorator('isDemotion', {
                    initialValue: this.checkVO.isDemotion
                  })(
                    <Radio.Group
                      onChange={this.onChangeJiangji}
                      value={this.state.isDemotion}
                    >
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Row>
            )}

            {this.state.isDemotion === 2 && (
              <Row>
                <Form.Item label='不降级原因'>
                  {getFieldDecorator('demotionInfo', {
                    initialValue: this.checkVO.demotionInfo,
                    rules: [
                      {
                        required: true,
                        message: '请输入原因'
                      }
                    ]
                  })(
                    <Input.TextArea
                      autosize={{ minRows: 2, maxRows: 6 }}
                    />
                  )}
                </Form.Item>
              </Row>
            )}
            {/**
             * 待审核状态显示同意和拒绝按钮
             */
              (
                this.isRefundStatusOf(
                  enumRefundStatus.WaitConfirm
                ) || this.isRefundStatusOf(
                  enumRefundStatus.WaitBossConfirm
                )
              ) && (
                <Form.Item wrapperCol={formLeftButtonLayout}>
                  <Button
                    type='primary'
                    onClick={() => this.handleAuditOperate(1)}
                  >
                  提交
                  </Button>
                  <Button
                    type='danger'
                    style={{ marginLeft: '20px' }}
                    onClick={() => this.handleAuditOperate(0)}
                  >
                  拒绝请求
                  </Button>
                </Form.Item>
              )}
          </Form>
        </Card>
      </div>
    )
  }
}

export default Form.create()(
  connect((state: any) => ({
    data: state[namespace].data || {}
  }))(withRouter(PendingReview))
)
