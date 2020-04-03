import React, { PureComponent } from 'react'
import { Card, Form } from 'antd'
import { detail } from './mock'

class FullDiscountDetailPage extends PureComponent {
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }

    console.log(detail)

    return (
      <Card
        bordered={false}
        title="查看活动"
      >
        <Form {...formItemLayout}>
          <Card type="inner" title="基本信息">
            <Form.Item label="活动名称">{detail.title}</Form.Item>
            <Form.Item label="活动时间">{detail.startTime} - {detail.endTime} </Form.Item>
          </Card>
          <Card type="inner" title="优惠信息">
            <Form.Item label="优惠种类">优惠种类</Form.Item>
            <Form.Item label="优惠类型">优惠类型</Form.Item>
            <Form.Item label="优惠条件">优惠条件</Form.Item>
          </Card>
          <Card type="inner" title="活动商品">
            <Form.Item label="指定活动">指定活动</Form.Item>
          </Card>
          <Card type="inner" title="活动说明">
            <Form.Item label="活动说明">活动说明</Form.Item>
          </Card>
        </Form>
      </Card>
    )
  }
}

export default FullDiscountDetailPage