import React from 'react';
import { Table, Form, Input, InputNumber, Card, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form'
import { getDetailColumns } from "../../constant";
import { refundType } from '@/enum';
import { formatPrice } from '@/util/format';
import UploadView from '@/components/upload';
import { XtSelect } from '@/components'
import { formItemLayout } from '@/config';
import ModifyAddressModal from './ModifyAddressModal';
import AfterSaleSelect from '../after-sale-select';
import { Decimal } from 'decimal.js';
import { getProductDetail, customerAdd } from '../../api'
import { enumRefundType } from '../../constant';
const { TextArea } = Input;

interface ApplyAfterSaleModalProps extends FormComponentProps {
  modalInfo: any;
  query: any;
}
interface ApplyAfterSaleModalState {
  skuDetail?: ApplyOrderSkuDetail.data;
  visible: boolean;
}
class ApplyAfterSaleModal extends React.Component<ApplyAfterSaleModalProps, ApplyAfterSaleModalState> {
  state: ApplyAfterSaleModalState = {
    visible: false
  }
  async fetchDetail() {
    const skuDetail: ApplyOrderSkuDetail.data = await getProductDetail(this.props.modalInfo);
    this.setState({ skuDetail });
    console.log('this.state.skuDetail => ', this.state.skuDetail);
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
        console.log('fields.imgUrl=>', fields.imgUrl)
        fields.imgUrl = fields.imgUrl.map((urlStr: string) => urlStr.replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', ''))
        console.log('fields.imgUrl=>', fields.imgUrl)
        if (fields.amount) {
          fields.amount = new Decimal(fields.amount).mul(100).toNumber();
        }
        console.log('modalInfo=>', modalInfo)
        const res: any = await customerAdd({
          childOrderId: modalInfo.childOrderId,
          mainOrderId: modalInfo.mainOrderId,
          memberId: modalInfo.memberId,
          skuId: modalInfo.skuId,
          ...fields
        });
        if (res.success) {
          message.success('申请售后成功');
          this.setState({
            visible: false
          }, this.props.query)
        }
      }
    })
  }
  render() {
    const { modalInfo, form: { getFieldDecorator } } = this.props;
    const price = parseFloat(formatPrice(modalInfo.ableRefundAmount))
    const initialObj: any = {}
    const disabledObj: any = {}
    if (modalInfo.childOrder && modalInfo.childOrder.orderStatus === 20) {
      initialObj.initialValue = '20'
      disabledObj.disabled = true
    }
    let { skuDetail } = this.state
    skuDetail = Object.assign({}, skuDetail)
    const { returnContact, returnPhone, province, city, district, street } = skuDetail;
    return (
      <Modal width='60%' style={{ top: 20 }} title="代客申请售后" visible={this.state.visible} onCancel={() => this.setState({ visible: false })} onOk={this.handleOk}>
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
              {getFieldDecorator('serverNum', { rules: [{ required: true, message: '请填写售后数目' }] })(<InputNumber min={1} max={10} placeholder="请输入" />)}（可选择数目：1-10）
            </Form.Item>
            {this.refundType === enumRefundType.Exchange ?
              <Form.Item label="用户收货地址">
                <ModifyAddressModal name={returnContact} phone={returnPhone} province={province} city={city} district={district} street={street} />
              </Form.Item>
              :
              <Form.Item label="退款金额">
                {getFieldDecorator('amount', { rules: [{ required: true, message: '请输入退款金额' }], initialValue: price })(<InputNumber min={0} max={+formatPrice(modalInfo.preferentialTotalPrice)} />)}
                <span className="ml10">（最多可退￥{formatPrice(modalInfo.ableRefundAmount)}）</span>
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
export default Form.create()(ApplyAfterSaleModal)