import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { formItemLayout, formButtonLayout } from '@/config'
import { XtSelect } from '@/components'

@Form.create({ name: 'delivery-information' })
class DeliveryInformation extends Component {
  render() {
    const { form: { getFieldDecorator }, checkType, onAuditOperate } = this.props;
    return (
      <Form {...formItemLayout}>
        <Form.Item label="物流公司">
          {getFieldDecorator('expressName', {})(<XtSelect placeholder="请选择" data={[{ key: '', val: '天天快递' }]} />)}
        </Form.Item>
        {checkType !== '30' && <Form.Item label="物流单号">
          {getFieldDecorator('expressCode', {})(<Input />)}
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
export default DeliveryInformation;