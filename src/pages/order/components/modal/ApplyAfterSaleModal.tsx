import React from 'react';
import { Table, Form, Input, InputNumber, Card } from 'antd';
import { FormComponentProps } from 'antd/lib/form'
import { getDetailColumns } from "../../constant";
import { refundType } from '@/enum';
import { formatPrice } from '@/util/format';
import UploadView from '@/components/upload';
import { XtSelect } from '@/components'
import { getRefundReason } from '../../api';
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};


interface Props extends FormComponentProps {
  modalInfo: any
}
interface State {
  refundReason: any
}
class ApplyAfterSaleModal extends React.Component<Props, State> {
  state: State = {
    refundReason: {}
  }
  isShowRefundAmount() {
    const refundType = this.props.form.getFieldValue('refundType');
    return refundType !== '30'
  }
  filterReason(obj: any) {
    return Object.entries(obj).map(([key, val]) => ({key, val}));
  }
  async fetchReason() {
    const refundReason = await getRefundReason();
    const result: any = {}
    for (let key in refundReason) {
      result[key] = this.filterReason(refundReason[key])
    }
    console.log('result=>', result);
    this.setState({refundReason: result})
  }
  componentDidMount() {
    this.fetchReason();
  }
  getRefundReason() {
    const refundType = this.props.form.getFieldValue('refundType');
    let result = []
    if (refundType && this.state.refundReason) {
      result = this.state.refundReason[refundType];
    }
    return result;
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
    console.log('modalInfo=>', modalInfo);
    
    return (
      <>
        <Table dataSource={[modalInfo]} columns={getDetailColumns()} pagination={false}></Table>
        <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
          <Form {...formItemLayout}>
            <Form.Item label="售后类型">
              {getFieldDecorator('refundType', {...initialObj,rules: [{ required: true, message: '请选择售后类型' }] })(<XtSelect {...disabledObj} data={refundType.getArray()} />)}
            </Form.Item>
            <Form.Item label="售后原因">
              {getFieldDecorator('returnReason', { rules: [{ required: true, message: '请选择售后原因' }] })(<XtSelect data={this.getRefundReason()} />)}
            </Form.Item>
            <Form.Item label="售后数目">
              {getFieldDecorator('serverNum')(<InputNumber min={0} max={10} placeholder="请输入"/>)}
            </Form.Item>
            <Form.Item label="用户收货地址">
              
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