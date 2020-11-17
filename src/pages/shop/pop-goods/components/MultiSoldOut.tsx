import React, { Component } from 'react'
import { Modal, Input, Radio } from 'antd'
import Form, { FormItem } from '@/packages/common/components/form'
import { FormComponentProps } from 'antd/lib/form'
const { TextArea } = Input

interface Props extends FormComponentProps {
  getInstance?: (ref: Main) => void
}

class Main extends Component<Props> {

  state = {
    visible: false
  }

  /** 隐藏模态框 */
  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  /** 显示模态框 */
  showModal = () => {
    this.setState({
      visible: true
    })
  }

  /** 确定操作 */
  handleOk = () => {
    const { form: { validateFields } } = this.props
    validateFields((err, values) => {
      if (err) return;
      //
    });
  }

  /** 取消操作 */
  handleCancel = () => {
    this.hideModal()
  }

  componentDidMount () {
    this.props.getInstance?.(this)
  }
  
  render() {
    const { form: { getFieldDecorator } } = this.props
    const { visible } = this.state

    return (
      <Form layout="vertical">
        <FormItem label="是否允许再次上架">
          {getFieldDecorator('isAllowShelves', {
            rules: [{
              required: true,
              message: '请选择！'
            }]
          })(
            <Radio.Group >
              <Radio value={0}>允许</Radio>
              <Radio value={1}>禁止</Radio>
            </Radio.Group>)}
        </FormItem>
        <FormItem label="违规原因">
          {getFieldDecorator('withdrawalInfo', {
            rules: [{
              required: true,
              message: '请输入违规原因！'
            }]
          })(
            <TextArea
              placeholder="请输入！"
              autoSize={{ minRows: 8, maxRows: 20 }}
            />)}
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(Main)