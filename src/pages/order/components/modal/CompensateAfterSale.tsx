import React from 'react'
import { Form, Input, InputNumber, Card, Modal, message, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import UploadView from '@/components/upload'
import { formItemLayout } from '@/config'
import { mul } from '@/util/utils'
import { getProductDetail, customerAdd } from '../../api'
const { TextArea } = Input
const { Option } = Select

interface Props extends FormComponentProps {
  modalInfo: any;
  successCb: () => void;
  onCancel: () => void;
  visible: boolean;
}
interface State {
  skuDetail?: any;
}

class ApplyAfterSale extends React.Component<Props, State> {
  state: State = {
    skuDetail: {}
  }
  isHaiTao: boolean
  async fetchDetail () {
    const skuDetail = await getProductDetail(this.props.modalInfo)
    if (!skuDetail) {
      return
    }
    this.setState({ skuDetail })
  }
  componentDidMount () {
    this.fetchDetail()
  }
  get refundType () {
    return this.props.form.getFieldValue('refundType')
  }
  handleOk = () => {
    const {
      form: { validateFields }
    } = this.props
    validateFields(async (errors, values) => {
      if (!errors) {
        values.imgUrl = Array.isArray(values.imgUrl) ? values.imgUrl.map((v: any) => v.url) : []
        values.imgUrl = values.imgUrl.map((urlStr: string) =>
          urlStr.replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', ''))
        if (values.amount) {
          values.amount = mul(values.amount, 100)
        }
        const skuDetail = this.state.skuDetail
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
  /**
   * 输入框输入的售后数目
   */
  get serverNum () {
    return this.props.form.getFieldValue('serverNum')
  }
  render () {
    const {
      modalInfo,
      form: { getFieldDecorator }
    } = this.props
    return (
      <Modal
        // width='60%'
        title='代客申请售后'
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleOk}
      >
        <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
          <Form {...formItemLayout}>
            <Form.Item label='补偿方式'>
              {getFieldDecorator('refundType', {
                rules: [
                  {
                    required: true,
                    message: '请选择'
                  }
                ]
              })(
                <Select style={{ width: '150px' }}>
                  <Option value='jack'>Jack</Option>
                  <Option value='lucy'>Lucy</Option>
                  <Option value='Yiminghe'>yiminghe</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label='补偿原因'>
              {getFieldDecorator('aa', {
                rules: [
                  {
                    required: true,
                    message: '请选择'
                  }
                ]
              })(
                <Select style={{ width: '150px' }}>
                  <Option value='jack'>Jack</Option>
                  <Option value='lucy'>Lucy</Option>
                  <Option value='Yiminghe'>yiminghe</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label='责任归属'>
              {getFieldDecorator('serverNum', {
                rules: [{ required: true, message: '请填写' }]
              })(
                <InputNumber
                  className='not-has-handler'
                  min={0}
                  placeholder='请输入'
                />
              )}
            </Form.Item>
            <Form.Item label='补偿金额'>
              {getFieldDecorator('amount', {
                rules: [{ required: true, message: '请输入' }]
              })(
                <InputNumber
                  min={0}
                />
              )}
              <span className='ml10'>
                当前级别免审核额度：¥20
              </span>
            </Form.Item>
            <Form.Item label='补偿凭证'>
              {getFieldDecorator('imgUrl')(
                <UploadView placeholder='' listType='picture-card' listNum={4} size={2} />
              )}
            </Form.Item>
            <Form.Item label='补偿说明'>
              {getFieldDecorator('info', {})(
                <TextArea />
              )}
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    )
  }
}
export default Form.create()(ApplyAfterSale)
