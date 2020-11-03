import React from 'react';
import { Card, Form, Input } from 'antd'
import WrapCard from './wrapCard'
import Image from '@/components/Image'
import Upload from '@/components/upload'
import { parseQuery } from '@/util/utils'

const FormItem = Form.Item
class BaseCard extends React.Component {
  query = parseQuery()
  componentDidMount () {
    this.props.getInstance?.(this)
  }
  render() {
    const { data, form } = this.props
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
    }
    const readyonly = !!this.query.readonly || data?.status !== 1
    return (
      <WrapCard
        data={data}
        render={baseInfo => (
          <Card title='商品信息'>
            <Form {...formItemLayout}>
              <FormItem label="商品类目">
                <div>
                  <p className="ant-form-text">{baseInfo.productCategory}</p>
                  {/* <p style={{color: 'red'}}>
                    技术服务费 {baseInfo?.productCategoryVO?.companyRate}%  推广佣金{baseInfo?.productCategoryVO?.agencyRate}%
                  </p> */}
                </div>
              </FormItem>
              {/* <FormItem label='佣金上浮'>
                <span className="ant-form-text">{baseInfo.commissionIncreaseRate}%</span>
              </FormItem> */}
              <FormItem label="商品名称">
                {readyonly ? (
                  <span className="ant-form-text">
                    {baseInfo.productName}
                  </span>
                ) : form.getFieldDecorator('productName', {
                    initialValue: baseInfo.productName,
                    rules: [
                      {
                        required: true,
                        message: '商品名称不能为空'
                      },
                      {
                        max: 36,
                        message: '商品名称最多36个字符'
                      }
                    ]
                  })(
                  <Input style={{ width: 400 }} />
                )}
              </FormItem>
              <FormItem label="商品图片">
                {readyonly ? (
                  <span className="ant-form-text">
                    {
                      baseInfo.productImage.map(item => (
                        <Image
                          style={{
                            width: 102,
                            height: 102,
                            marginRight: 10,
                            marginBottom: 10
                          }}
                          key={item.url}
                          src={item.url}
                        />
                      ))
                    }
                  </span>
                ) : (
                  <>
                    {form.getFieldDecorator('productImage', {
                      initialValue: baseInfo.productImage,
                      rules: [
                        {
                          validator: (rule, value, cb) => {
                            if (!value?.length) {
                              cb('请选择图片')
                            }
                            cb()
                          }
                        }
                      ]
                    })(
                      <Upload
                        listType='picture-card'
                        size={1}
                        listNum={9}
                      />
                    )}
                    <div style={{ color: '#999', fontSize: 12 }}>(建议尺寸宽度为750px，1M内, 上传最大限制数量为9张图片)</div>
                  </>
                )}
              </FormItem>
              <FormItem label="详情图片">
                {readyonly ? (
                  <span className="ant-form-text">
                   {
                     baseInfo.listImage.map(item => (
                       <Image
                         style={{
                           width: 102,
                           height: 102,
                           marginRight: 10,
                           marginBottom: 10
                         }}
                         key={item.url}
                         src={item.url}
                       />
                     ))
                   }
                 </span>
                ) : (
                  <>
                    {form.getFieldDecorator('listImage', {
                      initialValue: baseInfo.listImage,
                      rules: [
                        {
                          validator: (rule, value, cb) => {
                            if (!value?.length) {
                              cb('请选择图片')
                            }
                            cb()
                          }
                        }
                      ]
                    })(
                      <Upload
                        listType='picture-card'
                        listNum={9}
                        size={1}
                      />
                    )}
                    <div style={{ color: '#999', fontSize: 12 }}>(建议尺寸宽度为750px，1M内, 上传最大限制数量为9张图片)</div>
                  </>
                )}
              </FormItem>
              <FormItem label="累计销量">
                <span className="ant-form-text">{baseInfo.saleCount}</span>
              </FormItem>
            </Form>
          </Card>
        )}
      />
    )
  }
}

export default Form.create()(BaseCard)