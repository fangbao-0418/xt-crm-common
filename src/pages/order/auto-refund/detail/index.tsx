import React from 'react'
import { Card, Form, Input, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

const FormItem = Form.Item

interface Props extends FormComponentProps {}

class Main extends React.Component<Props> {
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

  render () {
    const {
      form: { getFieldDecorator }
    } = this.props

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
              <Input
                placeholder='请输入'
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='类目选择'>
            {getFieldDecorator('c', {
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
          <FormItem {...formItemLayout} label='会员等级'>
            {getFieldDecorator('d', {
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
          <FormItem {...formItemLayout} label='金额配置'>
            {getFieldDecorator('e', {
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