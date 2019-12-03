import React from 'react';
import { Table, Form, Input, InputNumber, Card, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form'
import { getDetailColumns } from "../../constant";
import { refundType } from '@/enum';
import { formatPrice } from '@/util/format';
import UploadView from '@/components/upload';
import { XtSelect } from '@/components'
import { formItemLayout } from '@/config';
import ModifyAddress from './ModifyShippingAddress';
import AfterSaleSelect from '../after-sale-select';
import { mul } from '@/util/utils';
import { getProductDetail, customerAdd } from '../../api'
import { enumRefundType } from '../../constant';
const { TextArea } = Input;

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
  constructor(props: Props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
  }
  async fetchDetail() {
    const skuDetail: ApplyOrderSkuDetail.data = await getProductDetail(this.props.modalInfo);
    this.setState({ skuDetail });
  }
  componentDidMount() {
    this.fetchDetail();
  }
  get refundType() {
    return this.props.form.getFieldValue('refundType')
  }
  handleOk = () => {
    const { form: { validateFields } } = this.props;
    validateFields(async (errors, values) => {
      if (!errors) {
        if (values.serverNum == 0) {
          message.error('售后数目必须大于0');
          return;
        }
        values.imgUrl = Array.isArray(values.imgUrl) ? values.imgUrl.map((v: any) => v.url) : [];
        values.imgUrl = values.imgUrl.map((urlStr: string) => urlStr.replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', ''))
        if (values.amount) {
          values.amount = mul(values.amount, 100);
        }
        const skuDetail = this.state.skuDetail;
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
        });
        if (res.success) {
          message.success('申请售后成功');
          this.props.successCb();
        }
      }
    })
  }
  onSuccess(data: any) {
    this.setState({
      skuDetail: Object.assign(this.state.skuDetail, data)
    })
  }
  /**
   * 输入框输入的售后数目
   */
  get serverNum() {
    return this.props.form.getFieldValue('serverNum');
  }
  /**
   * 售后商品单价
   */
  get unitPrice() {
    return this.state.skuDetail.unitPrice || 0;
  }
  /**
   * 相关金额
   */
  get relatedAmount() {
    let result = mul(this.unitPrice, this.serverNum);
    return Math.min(result, this.state.skuDetail.amount);
  }
  /**
  * 修改售后数目
  */
  handleChangeServerNum = (value: any = 0) => {
    let result = mul(this.unitPrice, value)
    this.props.form.setFieldsValue({
      amount: formatPrice(result)
    });
  }
  /**
   * 最终退款金额
   */
  get maxRefundAmount() {
    let { skuDetail } = this.state;
    let result = this.serverNum === skuDetail.serverNum ? skuDetail.amount : this.relatedAmount;
    return result;
  }
  render() {
    const { modalInfo, form: { getFieldDecorator } } = this.props;
    const initialObj: any = {}
    const disabledObj: any = {}
    console.log('modalInfo=>', modalInfo)
    if (modalInfo.childOrder && modalInfo.childOrder.orderStatus === 20) {
      initialObj.initialValue = 20
      disabledObj.disabled = true
    }
    let { skuDetail } = this.state
    skuDetail = Object.assign({}, skuDetail)
    const isHaiTao = Number(modalInfo.orderType) === 70
    const options = refundType.getArray()
    /** 海淘订单请选择售后类型没有换货 */
    const refundTypeOptions = isHaiTao ? options.filter(v => v.key !== 30): options
    return (
      <Modal
        width='80%'
        style={{ top: 20, minWidth: '900px' }}
        title="代客申请售后"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleOk}
      >
        <Table dataSource={[modalInfo]} columns={getDetailColumns()} pagination={false}></Table>
        <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
          <Form {...formItemLayout}>
            <Form.Item label="售后类型">
              {/* 海淘子订单售后类型不显示换货 */}
              {getFieldDecorator('refundType', {
                ...initialObj,
                rules: [{
                  required: true,
                  message: '请选择售后类型'
                }]
              })(<XtSelect {...disabledObj} data={refundTypeOptions} />)}
            </Form.Item>
            <Form.Item label="售后原因">
              {getFieldDecorator('returnReason', { rules: [{ required: true, message: '请选择售后原因' }] })(<AfterSaleSelect refundType={this.refundType} />)}
            </Form.Item>
            <Form.Item label="售后数目">
              {getFieldDecorator('serverNum', { rules: [{ required: true, message: '请填写售后数目' }], initialValue: skuDetail.serverNum })(
                <InputNumber
                  min={0}
                  max={skuDetail.serverNum}
                  placeholder="请输入"
                  onChange={this.handleChangeServerNum}
                />
              )}（最多可售后数目：{skuDetail.serverNum}）
            </Form.Item>
            {this.refundType === enumRefundType.Exchange ?
              <Form.Item label="用户收货地址">
                <ModifyAddress detail={skuDetail} onSuccess={this.onSuccess} />
              </Form.Item>
              :
              <Form.Item label="退款金额">
                {getFieldDecorator('amount',
                  {
                    rules: [
                      { required: true, message: '请输入退款金额' }
                    ],
                    initialValue: formatPrice(skuDetail.amount)
                  }
                )(
                  <InputNumber
                    min={0}
                    disabled={isHaiTao}
                    max={formatPrice(this.maxRefundAmount)}
                  />
                )}
                <span className="ml10">（最多可退￥{`${formatPrice(this.maxRefundAmount)}${isHaiTao ? '，已包含税费' : ''}`}）</span>
              </Form.Item>
            }
            <Form.Item label="售后凭证">
              {getFieldDecorator('imgUrl')(
                <UploadView
                  placeholder=""
                  listType="picture-card"
                  listNum={4}
                  size={2} />
              )}
            </Form.Item>
            <Form.Item label="售后说明">
              {getFieldDecorator('info', {})(<TextArea />)}
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    )
  }
}
export default Form.create()(ApplyAfterSale)