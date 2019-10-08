import React from 'react';
import { Table, Form, Input, InputNumber, Card, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form'
import { getDetailColumns } from "../../constant";
import { refundType } from '@/enum';
import { formatPrice } from '@/util/format';
import UploadView from '@/components/upload';
import { XtSelect } from '@/components'
import { formItemLayout } from '@/config';
import ModifyAddress from './ModifyAddress';
import AfterSaleSelect from '../after-sale-select';
import { Decimal } from 'decimal.js';
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
    const { form: { getFieldsValue, validateFields } } = this.props;
    validateFields(async (errors, values) => {
      if (!errors) {
        const { modalInfo } = this.props;
        const fields = getFieldsValue();
        fields.imgUrl = Array.isArray(fields.imgUrl) ? fields.imgUrl.map(v => v.url) : [];
        fields.imgUrl = fields.imgUrl.map((urlStr: string) => urlStr.replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', ''))
        if (fields.amount) {
          fields.amount = new Decimal(fields.amount).mul(100).toNumber();
        }
        const skuDetail = this.state.skuDetail;
        const res: any = await customerAdd({
          childOrderId: modalInfo.childOrderId,
          mainOrderId: modalInfo.mainOrderId,
          memberId: modalInfo.memberId,
          skuId: modalInfo.skuId,
          province: skuDetail.province,
          provinceId: skuDetail.provinceId,
          city: skuDetail.city,
          cityId: skuDetail.cityId,
          district: skuDetail.district,
          districtId: skuDetail.districtId,
          ...fields
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
  render() {
    const { modalInfo, form: { getFieldDecorator } } = this.props;
    const initialObj: any = {}
    const disabledObj: any = {}
    if (modalInfo.childOrder && modalInfo.childOrder.orderStatus === 20) {
      initialObj.initialValue = '20'
      disabledObj.disabled = true
    }
    let { skuDetail } = this.state
    skuDetail = Object.assign({}, skuDetail)
    const price = skuDetail.amount ? parseFloat(formatPrice(skuDetail.amount)): 0;
    console.log('price=>', price)
    return (
      <Modal width='60%' style={{ top: 20 }} title="代客申请售后" visible={this.props.visible} onCancel={this.props.onCancel} onOk={this.handleOk}>
        <Table dataSource={[modalInfo]} columns={getDetailColumns()} pagination={false}></Table>
        <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
          <Form {...formItemLayout}>
            <Form.Item label="售后类型">
              {getFieldDecorator('refundType', { ...initialObj, rules: [{ required: true, message: '请选择售后类型' }] })(<XtSelect {...disabledObj} data={refundType.getArray()} />)}
            </Form.Item>
            <Form.Item label="售后原因">
              {getFieldDecorator('returnReason', { rules: [{ required: true, message: '请选择售后原因' }] })(<AfterSaleSelect refundType={this.refundType} />)}
            </Form.Item>
            <Form.Item label="售后数目">
              {getFieldDecorator('serverNum', { rules: [{ required: true, message: '请填写售后数目' }], initialValue: skuDetail.serverNum })(<InputNumber min={1} max={skuDetail.serverNum} placeholder="请输入" />)}（最多可售后数目：{skuDetail.serverNum}）
            </Form.Item>
            {this.refundType === enumRefundType.Exchange ?
              <Form.Item label="用户收货地址">
                <ModifyAddress detail={skuDetail} onSuccess={this.onSuccess}/>
              </Form.Item>
              :
              <Form.Item label="退款金额">
                {getFieldDecorator('amount', { rules: [{ required: true, message: '请输入退款金额' }], initialValue: price })(<InputNumber min={0} max={+formatPrice(skuDetail.amount)} />)}
                <span className="ml10">（最多可退￥{formatPrice(skuDetail.amount)}）</span>
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