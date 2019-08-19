import React, { Component } from 'react';
import { Table, Form, Input, InputNumber, Card } from 'antd';
import { goodsTableColumn } from "../constant";
import { refundType, returnReason } from '@/enum';
import { formatPrice } from '@/util/format';
import UploadView from '@/components/upload';
import { XtSelect } from '@/components'
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
  isShowRefundAmount() {
    const { refundType } = this.props.form.getFieldsValue(['refundType']);
    return refundType !== '30'
  }
  render() {
    const { modalInfo, form: { getFieldDecorator } } = this.props;
    const price = parseFloat(formatPrice(modalInfo.buyPrice))
    return (
      <>
        <Table dataSource={[modalInfo]} columns={goodsTableColumn} pagination={false}></Table>
        <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
          <Form {...formItemLayout}>
            <Form.Item label="售后类型">
              {getFieldDecorator('refundType', { rules: [{ required: true }] })(<XtSelect data={refundType.getArray()} />)}
            </Form.Item>
            <Form.Item label="售后原因">
              {getFieldDecorator('returnReason', { rules: [{ required: true }] })(<XtSelect data={returnReason.getArray()} />)}
            </Form.Item>
            {this.isShowRefundAmount() && (
              <Form.Item label="退款金额">
                {getFieldDecorator('amount', { rules: [{ required: true, message: '请输入退款金额' }], initialValue: price })(<InputNumber min={0} max={price} />)}
                <span className="ml10">（最多可退￥{formatPrice(modalInfo.totalPrice)}）</span>
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