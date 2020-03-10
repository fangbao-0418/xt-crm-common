import React from 'react';
import { Card, Form } from 'antd';
import WrapCard from './wrapCard'
import Image from '@/components/Image';

const FormItem = Form.Item

class BaseCard extends React.Component {
  render() {

    const { data } = this.props

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
    };

    return (
      <WrapCard
        data={data}
        render={baseInfo => (
          <Card title='商品信息'>
            <Form {...formItemLayout}>
              <FormItem label="商品类目">
                <span className="ant-form-text">{baseInfo.productCategory}</span>
              </FormItem>
              <FormItem label="商品名称">
                <span className="ant-form-text">{baseInfo.productName}</span>
              </FormItem>
              <FormItem label="商品图片">
                <span className="ant-form-text">
                  {
                    baseInfo.productImage.map(url => (
                      <Image
                        style={{
                          width: 102,
                          height: 102,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                        key={url}
                        src={url}
                      />
                    ))
                  }
                </span>
              </FormItem>
              <FormItem label="详情图片">
                <span className="ant-form-text">
                  {
                    baseInfo.listImage.map(url => (
                      <Image
                        style={{
                          width: 102,
                          height: 102,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                        key={url}
                        src={url}
                      />
                    ))
                  }
                </span>
              </FormItem>
              <FormItem label="累计销量">
                <span className="ant-form-text">{baseInfo.showNum}</span>
              </FormItem>
            </Form>
          </Card>
        )}
      />
    )
  }
}

export default BaseCard;