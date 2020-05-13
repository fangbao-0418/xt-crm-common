import React from 'react'
import { Card, Form, Input, Button, Checkbox, InputNumber, Row, Col, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import ProductCategory from '../components/product-category'
import BlacklistModal from '../components/blacklist-modal'

const FormItem = Form.Item

interface Props extends FormComponentProps {}

class Main extends React.Component<Props> {
  blacklistModal: any

  handleSubmit = (e: any) => {
    e.preventDefault()
    const { form } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      console.log(values)
    })
  }

  handleBlack = () => {
    const {
      form: { getFieldValue }
    } = this.props
    const c = getFieldValue('c')
    if (c?.length) {
      this.blacklistModal.show()
    } else {
      Modal.warning({
        title: '提示',
        content: '请选择类目'
      })
    }
  }

  render () {
    const {
      form: { getFieldDecorator, getFieldValue }
    } = this.props

    const c = getFieldValue('c')

    console.log(c)

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      }
    }

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 4 }
      }
    }

    return (
      <Card
        title='新增配置'
        bordered={false}
      >
        <BlacklistModal wrappedComponentRef={(ref: any) => this.blacklistModal = ref} />
        <Form
          onSubmit={this.handleSubmit}
        >
          <FormItem {...formItemLayout} label='配置名称'>
            {getFieldDecorator('a', {
              rules: [
                {
                  required: true,
                  message: '请输入'
                }
              ]
            })(
              <Input
                placeholder='请输入'
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='售后类型选择'>
            {getFieldDecorator('b', {
              rules: [
                {
                  required: true,
                  message: '请输入'
                }
              ]
            })(
              <Checkbox.Group
                options={[
                  { label: '全选', value: '' },
                  { label: '退货退款', value: '1' },
                  { label: '换货', value: '2' }
                ]}
              />
            )}
          </FormItem>
          <FormItem
            label='类目选择'
            {...{
              labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 }
              }
            }}
          >
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('c', {
                  rules: [
                    {
                      required: true,
                      message: '请选择'
                    }
                  ]
                })(
                  <ProductCategory
                    // style={{ width: 370 }}
                  />
                )}
              </Col>
              <Col span={12}>
                <Button
                  type='link'
                  onClick={this.handleBlack}
                  style={{ color: c?.length ? '#40a9ff' : '#999999' }}
                >
                  商品黑名单设置
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem
            {...{
              labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 }
              }
            }}
            label='会员等级'
          >
            {getFieldDecorator('d', {
              rules: [
                {
                  required: true,
                  message: '请选择'
                }
              ]
            })(
              <Checkbox.Group
                options={[
                  { label: '全选', value: '' },
                  { label: '普通会员', value: '1' },
                  { label: '团长', value: '2' },
                  { label: '社区管理员', value: '3' },
                  { label: '城市合伙人', value: '4' },
                  { label: '管理员', value: '5' }
                ]}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='金额配置'>
            {getFieldDecorator('e', {
              rules: [
                {
                  required: true,
                  message: '请输入'
                }
              ]
            })(
              <InputNumber
                placeholder='请输入'
              />
            )}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button
              type='primary'
              htmlType='submit'
            >
              保存
            </Button>
            <Button
              style={{ marginLeft: 16 }}
              onClick={() => {
                APP.history.push('/order/autoRefundRule')
              }}
            >
              取消
            </Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(Main)