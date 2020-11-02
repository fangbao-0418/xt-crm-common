import React from 'react'
import { Table, Form, Input, InputNumber, Card, Modal, message } from 'antd'
import { If } from '@/packages/common/components'
import { FormComponentProps } from 'antd/lib/form'
import { getDetailColumns } from '../../constant'
import { refundType } from '@/enum'
import { formatPrice } from '@/util/format'
import UploadView from '@/components/upload'
import { XtSelect } from '@/components'
import { formItemLayout } from '@/config'
import ModifyAddress from './ModifyShippingAddress'
import AfterSaleSelect from '../after-sale-select'
import { mul } from '@/util/utils'
import { getProductDetail, customerAdd, checkRefundCoupon } from '../../api'
import { enumRefundType } from '../../constant'
const { TextArea } = Input

interface Props extends FormComponentProps {
  modalInfo: any;
  successCb: () => void;
  onCancel: () => void;
  visible: boolean;
}
interface State {
  skuDetail?: any;
  refundTypeValue?: any
  deductionInfo?: any
}

class ApplyAfterSale extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      skuDetail: {},
      refundTypeValue: this.initRefundTypeValue()
    }
  }
  isHaiTao: boolean
  async fetchDetail () {
    let skuDetail: Partial<ApplyOrderSkuDetail.data> = await getProductDetail(this.props.modalInfo?.childOrder?.id)
    if (!skuDetail) {
      APP.moon.error({
        label: '订单申请售后',
        label2: 'getProductDetail',
        data: skuDetail,
        data2: this.props.modalInfo
      })
      skuDetail = {}
    }
    this.setState({ skuDetail })
  }
  /* 校验满赠优惠券金额 */
  checkRefundCoupon = (data: { childOrderId: number, refundNum?: number, refundAmount?: number, refundType?: number }, cb?: () => void) => {
    checkRefundCoupon(data).then((deductionInfo: any) => {
      if (deductionInfo) {
        this.setState({
          deductionInfo
        })
      }
    })
  }
  initRefundTypeValue = () => {
    const { modalInfo } = this.props
    if (modalInfo.childOrder && modalInfo.childOrder.orderStatus === 20) {
      return 20
    }
    return undefined
  }
  componentDidMount () {
    const { modalInfo } = this.props
    if (modalInfo?.orderType === 56) {
      // 56：直播红包类型
      return
    }
    this.fetchDetail()
    this.checkRefundCoupon({
      childOrderId: modalInfo.childOrderId
    })
  }
  handleOk = () => {
    const {
      form: { validateFields }
    } = this.props
    validateFields(async (errors, values) => {
      if (!errors) {
        if (values.serverNum == 0) {
          message.error('售后数目必须大于0')
          return
        }
        values.imgUrl = Array.isArray(values.imgUrl) ? values.imgUrl.map((v: any) => v.url) : []
        values.imgUrl = values.imgUrl.map((urlStr: string) =>
          urlStr.replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', ''))
        console.log(values.amount, 'values.amount')
        if (values.amount) {
          values.amount = mul(values.amount, 100)
        }
        const skuDetail = this.state.skuDetail
        console.log(values, values.amount, 777)
        const res: any = await customerAdd({
          childOrderId: skuDetail.childOrderId,
          mainOrderId: skuDetail.orderId,
          skuId: skuDetail.skuId,
          province: skuDetail.province,
          provinceId: skuDetail.provinceId,
          city: skuDetail.city,
          cityId: skuDetail.cityId,
          district: skuDetail.district,
          districtId: skuDetail.districtId,
          contact: skuDetail.returnContact,
          phone: skuDetail.returnPhone,
          street: skuDetail.street,
          ...values
        })
        if (res.success) {
          message.success('申请售后成功')
          this.props.successCb()
        }
      }
    })
  };
  onSuccess = (data: any) => {
    this.setState({
      skuDetail: Object.assign(this.state.skuDetail, data)
    })
  }
  get refundType () {
    return this.props.form.getFieldValue('refundType')
  }
  /**
   * 输入框输入的售后数目
   */
  get serverNum () {
    return this.props.form.getFieldValue('serverNum')
  }
  /**
   * 售后商品单价
   */
  get unitPrice () {
    return this.state.skuDetail.unitPrice || 0
  }
  /**
   * 相关金额
   */
  get relatedAmount () {
    const result = mul(this.unitPrice, this.serverNum)
    return Math.min(result, this.state.skuDetail.amount)
  }
  /**
   * 修改售后数目
   */
  handleChangeServerNum = (value: any = 0) => {
    let result = mul(this.unitPrice, value)
    if (value == this.state.skuDetail.serverNum) {
      result = this.state.skuDetail.amount
    }
    this.props.form.setFieldsValue({
      amount: formatPrice(result)
    })
  };
  /**
   * 最终退款金额
   */
  get maxRefundAmount () {
    const { skuDetail } = this.state
    const result = this.serverNum === skuDetail.serverNum ? skuDetail.amount : this.relatedAmount
    return result
  }
  // 未发货状态下，CRM发起申请售后，选择仅退款时，不可选择售后数目和金额（直接按最大值来）
  getDisabledStatus () {
    const refundType = this.props.form.getFieldValue('refundType')
    return refundType === 20
  }
  disabledAmount () {
    return this.isHaiTao || this.getDisabledStatus()
  }

  refundTypeChange = (refundTypeValue: any) => {
    const {
      modalInfo,
      form: { getFieldValue, setFieldsValue }
    } = this.props
    this.setState({
      refundTypeValue
    }, () => {
      const serverNum = getFieldValue('serverNum')
      if (serverNum) {
        console.log(modalInfo.dealPrice, formatPrice(modalInfo.dealPrice * serverNum), 'formatPrice(modalInfo.dealPrice * serverNum)')
        const maxRefundAmount = formatPrice(this.maxRefundAmount)
        const calcAmount = formatPrice(modalInfo.dealPrice * serverNum)
        setFieldsValue({
          amount: calcAmount > maxRefundAmount ? maxRefundAmount : calcAmount
        })
      }
    })
  }
  render () {
    const {
      modalInfo,
      form: { getFieldDecorator }
    } = this.props
    const { refundTypeValue, deductionInfo } = this.state
    const initialObj: any = {}
    const disabledObj: any = {}
    if (modalInfo.childOrder && modalInfo.childOrder.orderStatus === 20) {
      initialObj.initialValue = 20
      disabledObj.disabled = true
    }
    let { skuDetail } = this.state
    skuDetail = Object.assign({}, skuDetail)
    this.isHaiTao = Number(modalInfo.orderType) === 70
    const options = refundType.getArray()
    /** 海淘订单请选择售后类型没有换货 */
    const refundTypeOptions = this.isHaiTao ? options.filter(v => v.key !== 30) : options
    console.log(skuDetail, modalInfo, 200)
    return (
      <Modal
        width='80%'
        style={{ top: 20, minWidth: '900px' }}
        title='代客申请售后'
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleOk}
      >
        <Table dataSource={[modalInfo]} columns={getDetailColumns()} pagination={false}></Table>
        <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
          <Form {...formItemLayout}>
            <If condition={!!deductionInfo?.deductionStr}>
              <Form.Item label='提示'>
                <span style={{ color: 'red' }}>{skuDetail.deductionStr}</span>
              </Form.Item>
            </If>
            <Form.Item label='售后类型'>
              {/* 海淘子订单售后类型不显示换货 */}
              {getFieldDecorator('refundType', {
                ...initialObj,
                rules: [
                  {
                    required: true,
                    message: '请选择售后类型'
                  }
                ]
              })(
                <XtSelect
                  {...disabledObj}
                  onChange={this.refundTypeChange}
                  data={refundTypeOptions}
                />
              )}
            </Form.Item>
            <Form.Item label='售后原因'>
              {getFieldDecorator('returnReason', {
                rules: [
                  {
                    required: true,
                    message: '请选择售后原因'
                  }
                ]
              })(<AfterSaleSelect refundType={refundTypeValue} />)}
            </Form.Item>
            <Form.Item label='售后数目'>
              {getFieldDecorator('serverNum', {
                rules: [{ required: true, message: '请填写售后数目' }],
                initialValue: skuDetail.serverNum
              })(
                <InputNumber
                  className='not-has-handler'
                  min={0}
                  max={skuDetail.serverNum}
                  disabled={this.getDisabledStatus()}
                  placeholder='请输入'
                  onChange={this.handleChangeServerNum}
                />
              )}
              （最多可售后数目：{skuDetail.serverNum}）
            </Form.Item>
            <If condition={refundTypeValue === enumRefundType.Exchange}>
              <Form.Item label='用户收货地址'>
                <ModifyAddress detail={skuDetail} onSuccess={this.onSuccess} />
              </Form.Item>
            </If>
            <If condition={refundTypeValue !== enumRefundType.Exchange}>
              <Form.Item label={'退款金额' + formatPrice(skuDetail.amount)}>
                {getFieldDecorator('amount', {
                  rules: [{ required: true, message: '请输入退款金额' }],
                  initialValue: formatPrice(skuDetail.amount)
                })(
                  <InputNumber
                    min={0}
                    disabled={this.disabledAmount()}
                    max={formatPrice(this.maxRefundAmount)}
                  />
                )}
                <span className='ml10'>
                  （最多可退￥{`${formatPrice(this.maxRefundAmount)}${this.isHaiTao ? '，已包含税费' : ''}`}）
                </span>
              </Form.Item>
            </If>
            <Form.Item label='售后凭证'>
              {getFieldDecorator('imgUrl')(<UploadView placeholder='' listType='picture-card' listNum={4} size={2} />)}
            </Form.Item>
            <Form.Item label='售后说明'>{getFieldDecorator('info', {})(<TextArea />)}</Form.Item>
          </Form>
        </Card>
      </Modal>
    )
  }
}
export default Form.create()(ApplyAfterSale)
