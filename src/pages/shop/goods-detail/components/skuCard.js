import React from 'react';
import { Card, Form } from 'antd';

const FormItem = Form.Item

class SkuCard extends React.Component {
  render() {
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
    };

    return (
      <Card title='规格信息'>
        <Form {...formItemLayout}>
          <FormItem label="商品类目">
            <span className="ant-form-text">商品类目</span>
          </FormItem>
          <FormItem label="商品名称">
            <span className="ant-form-text">商品名称</span>
          </FormItem>
          <FormItem label="商品图片">
            <span className="ant-form-text">商品名称</span>
          </FormItem>
          <FormItem label="详情图片">
            <span className="ant-form-text">详情图片</span>
          </FormItem>
          <FormItem label="累计销量">
            <span className="ant-form-text">累计销量</span>
          </FormItem>
        </Form>

      </Card>
    )
  }
}

export default SkuCard