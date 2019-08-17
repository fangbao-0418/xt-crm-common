import React, { useState } from 'react';
import { formItemLayout } from '@/config';
import { DatePicker, Card, Form, Checkbox, Input, Button, Radio } from 'antd';
const plainOptions = ['普通用户', '团长', '体验团长', '星级团长', '社区管理员', '城市合伙人'];

// 批量发券
function BulkIssuing({ form: { getFieldDecorator } }) {
  console.log(getFieldDecorator)
  const [radioKey, setRadioKey] = useState(1)
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  }
  return (
    <Card>
      {/* <Row>
        <Col offset={5}>
          <h2>基本信息</h2>
        </Col>
      </Row> */}
      <Form {...formItemLayout}>
        <Form.Item label="优惠券名称">中秋国庆发券</Form.Item>
        <Form.Item label="目标用户">
          <Radio.Group onChange={event => setRadioKey(event.target.value)} value={radioKey}>
            <Radio style={radioStyle} value={1}>全部用户</Radio>
            <Radio style={radioStyle} value={2}>按用户等级</Radio>
            <div>
              <Checkbox.Group options={plainOptions} />
            </div>
            <Radio style={radioStyle} value={3}>指定用户</Radio>
            <Input.TextArea rows={4} />
            <Button type="link">上传excel</Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="发送时间">
          <Radio.Group onChange={event => setRadioKey(event.target.value)} value={radioKey}>
            <Radio style={radioStyle} value={1}>立即发送</Radio>
            <Radio style={radioStyle} value={2}>定时发送</Radio>
            <div>
              选择时间：<DatePicker />
            </div>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary">保存</Button>
          <Button>取消</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
export default Form.create({ name: 'bulk-issuing' })(BulkIssuing);