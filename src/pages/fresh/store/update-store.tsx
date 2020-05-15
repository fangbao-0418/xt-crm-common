import React from 'react'
import { Modal, Input, Form, message } from 'antd'
import { updateInvite } from './api'
import _ from 'lodash'
import { FormComponentProps } from 'antd/lib/form'
const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 14 }
  }
}
export interface Props extends FormComponentProps {
  visible?: boolean
  onOk: (data?: any) => void
  onCancel: () => void
}
export interface State extends PageProps<Coupon.CouponItemProps> {
  visible: boolean
}
class UpdateStoreModal extends React.Component<Props, State> {
  public state: State = {
    records: [],
    visible: this.props.visible || false
  }

  public constructor (props: Props) {
    super(props)
  }
  componentDidMount () {
    this.props.form.resetFields()
  }

  public componentWillReceiveProps (props: Props) {
    this.setState({
      visible: props.visible || false
    })
  }
  public onOk = () => {
    this.props.form.validateFields(async (errors, values) => {
      if (!errors) {
        updateInvite({
          selfMemberPhone: values.selfMemberPhone,
          inviteMemberPhone: values.inviteMemberPhone
        }).then((data:any) => {
          if (this.props.onOk && data) {
            message.success('修改成功')
            this.props.onOk(true)
            this.setState({
              visible: false
            })
          }
        })

      }
    })
  }
  public render () {
    const { visible } = this.state
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='修改邀请门店'
        visible={visible}
        width={600}
        onOk={this.onOk}
        onCancel={() => {
          this.props.onCancel && this.props.onCancel()
        }}
      >
        <Form {...formItemLayout}>
          <Form.Item label='店长手机号'>
            {getFieldDecorator('selfMemberPhone', {
              rules: [
                {
                  required: true,
                  message: '请输入店长手机号'
                }
              ]
            })(<Input maxLength={20} placeholder='请输入' />)}
          </Form.Item>
          <Form.Item label='上级手机号'>
            {getFieldDecorator('inviteMemberPhone', {
              rules: [
                {
                  required: true,
                  message: '请输入上级手机号'
                }
              ]
            })(<Input maxLength={20} placeholder='请输入' />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create<Props>()(UpdateStoreModal)
