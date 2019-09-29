import React from 'react';
import { Table, Form, Input, InputNumber, Card } from 'antd';
import { FormComponentProps } from 'antd/lib/form'
import { getDetailColumns } from "../../constant";
import { refundType } from '@/enum';
import { formatPrice } from '@/util/format';
import UploadView from '@/components/upload';
import { XtSelect } from '@/components'
import { formItemLayout } from '@/config';
import ModifyAddressModal from './ModifyAddressModal';
import AfterSaleSelect from '../after-sale-select';
import { getProductDetail } from '../../api'
const { TextArea } = Input;

interface ApplyAfterSaleModalProps extends FormComponentProps {
  modalInfo: any;
}
interface ApplyAfterSaleModalState {
  skuDetail?: ApplyOrderSkuDetail.data;
}
class ApplyAfterSaleModal extends React.Component<ApplyAfterSaleModalProps, ApplyAfterSaleModalState> {
  state: ApplyAfterSaleModalState = {
  }
  isShowRefundAmount() {
    const refundType = this.props.form.getFieldValue('refundType');
    return refundType !== '30'
  }
  async fetchDetail() {
    const skuDetail: ApplyOrderSkuDetail.data = await getProductDetail(this.props.modalInfo);
    this.setState({ skuDetail });
    console.log('this.state.skuDetail => ', this.state.skuDetail);
  }
  componentDidMount() {
    this.fetchDetail();
  }
  getRefundType() {
    return this.props.form.getFieldValue('refundType')
  }
  render() {
    const { modalInfo, form: { getFieldDecorator } } = this.props;
    const price = parseFloat(formatPrice(modalInfo.ableRefundAmount))
    const initialObj: any = {}
    const disabledObj: any = {}
    if (modalInfo.childOrder.orderStatus === 20) {
      initialObj.initialValue = '20'
      disabledObj.disabled = true
    }
    let { skuDetail } =  this.state
    skuDetail = Object.assign({}, skuDetail)
    const {returnContact, returnPhone, province, city, district, street} = skuDetail;
    return (
      <>
        <Table dataSource={[modalInfo]} columns={getDetailColumns()} pagination={false}></Table>
        <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
          <Form {...formItemLayout}>
            <Form.Item label="售后类型">
              {getFieldDecorator('refundType', {...initialObj,rules: [{ required: true, message: '请选择售后类型' }] })(<XtSelect {...disabledObj} data={refundType.getArray()} />)}
            </Form.Item>
            <Form.Item label="售后原因">
              {getFieldDecorator('returnReason', { rules: [{ required: true, message: '请选择售后原因' }] })(<AfterSaleSelect refundType={this.getRefundType()} />)}
            </Form.Item>
            <Form.Item label="售后数目">
              {getFieldDecorator('serverNum')(<InputNumber min={0} max={10} placeholder="请输入"/>)}
            </Form.Item>
            <Form.Item label="用户收货地址">
              <ModifyAddressModal name={returnContact} phone={returnPhone} province={province} city={city} district={district} street={street}/>
            </Form.Item>
            {this.isShowRefundAmount() && (
              <Form.Item label="退款金额">
                {getFieldDecorator('amount', { rules: [{ required: true, message: '请输入退款金额' }], initialValue: price })(<InputNumber min={0} max={+formatPrice(modalInfo.preferentialTotalPrice)} />)}
                <span className="ml10">（最多可退￥{formatPrice(modalInfo.ableRefundAmount)}）</span>
              </Form.Item>
            )}
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
      </>
    )
  }
}
export default Form.create()(ApplyAfterSaleModal)