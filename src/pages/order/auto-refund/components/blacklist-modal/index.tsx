import React from 'react'
import { Form, Input, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

const FormItem = Form.Item
const { TextArea } = Input

interface Props extends FormComponentProps {}

class Main extends React.Component<FormComponentProps> {
  state = {
    visible: false
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  handleOk = () => {
    const { form } = this.props
    form.validateFieldsAndScroll((err, { a }) => {
      if (err) {
        return
      }
      a = a.replace(/\n/g, ',')
      console.log(a)
    })
  }

  show = () => {
    this.setState({
      visible: true
    })
  }

  hide = () => {
    this.setState({
      visible: false
    })
  }

  render () {
    const {
      form: { getFieldDecorator }
    } = this.props
    const { visible } = this.state

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 }
      }
    }

    return (
      <Modal
        title='按商品ID批量设置黑名单'
        visible={visible}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Form>
          <FormItem {...formItemLayout}>
            {getFieldDecorator('a', {
              rules: [
                {
                  validator: (rule, value, cb) => {
                    const reg = /^\d+$/
                    if (!reg.test(value)) {
                      cb('请添加商品Id,并按enter键隔开~')
                      // return
                    } else {
                      cb()
                    }
                  }
                }
              ]
            })(
              <TextArea autoSize={{ minRows: 6 }} placeholder='请输入已选择类目下需要设置黑名单的商品ID，以换行区分' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(Main)