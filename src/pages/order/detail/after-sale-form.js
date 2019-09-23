import React, { Component } from 'react';
import { Table, Form, Input, InputNumber, Card } from 'antd';
import { getDetailColumns } from "../constant";
import { refundType } from '@/enum';
import { formatPrice } from '@/util/format';
import UploadView from '@/components/upload';
import { XtSelect } from '@/components'
import { getRefundReason } from '../api';
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

class AfterSaleForm extends Component {
  state = {
    refundReason: {}
  }
  isShowRefundAmount() {
    const refundType = this.props.form.getFieldValue('refundType');
    return refundType !== '30'
  }
  filterReason(obj) {
    return Object.entries(obj).map(([key, val]) => ({key, val}));
  }
  async fetchReason() {
    const refundReason = await getRefundReason();
    const result = {}
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
    const initialObj = {}
    const disabledObj = {}
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
              {getFieldDecorator('refundType', {...initialObj,rules: [{ required: true }] })(<XtSelect {...disabledObj} data={refundType.getArray()} />)}
            </Form.Item>
            <Form.Item label="售后原因">
              {getFieldDecorator('returnReason', { rules: [{ required: true }] })(<XtSelect data={this.getRefundReason()} />)}
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
export default Form.create({ name: 'after_sale_form' })(AfterSaleForm);