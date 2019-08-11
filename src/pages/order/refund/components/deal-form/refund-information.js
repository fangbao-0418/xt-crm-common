import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { formItemLayout, formButtonLayout } from '@/config'
import { XtSelect } from '@/components'
import refundType from '@/enum/refundType';

@Form.create({ name: 'refund-information' })
class RefundInformation extends Component {
  render() {
    const { form: { getFieldDecorator }, orderServerVO, checkType, checkVO, onAuditOperate } = this.props;
    return (
      <Form {...formItemLayout}>
        <Form.Item label="退款类型">
          {getFieldDecorator('refundType', {
            initialValue: orderServerVO.refundType
          })(<XtSelect placeholder="请选择退款类型" data={refundType.getArray()} />)}
        </Form.Item>
        {checkType !== '30' && <Form.Item label="退款金额">
          {getFieldDecorator('refundAmount', {
            initialValue: checkVO.refundAmount
          })(<Input />)}
        </Form.Item>}
        <Form.Item label="说明">
          {getFieldDecorator('info', {
          })(<Input.TextArea
            placeholder=""
            autosize={{ minRows: 2, maxRows: 6 }}
          />)}
        </Form.Item>
        <Form.Item wrapperCol={formButtonLayout} style={{marginBottom: 0}}>
          <Button type="primary" onClick={() => onAuditOperate(1)}>提交</Button>
          <Button type="danger ml20" onClick={() => onAuditOperate(0)}>拒绝</Button>
        </Form.Item>
      </Form>
    );
  }
}
export default RefundInformation;