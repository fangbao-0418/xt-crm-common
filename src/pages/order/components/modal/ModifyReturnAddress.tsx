import React from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form'
interface State {
  visible: boolean;
}
interface Props extends FormComponentProps {
  detail: any;
  intercept: any;
  onSuccess(data: any): void;
}
class ModifyReturnAddress extends React.Component<Props, State> {
  state: State = {
    visible: false
  }
  constructor(props: Props) {
    super(props)
    this.handleOk = this.handleOk.bind(this)
  }
  handleOk() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.onSuccess(values);
        this.setState({ visible: false });
      }
    })
  }
  render() {
    const { detail, intercept } = this.props;
    const { returnContact, returnPhone, returnAddress } = detail;
    const { memberName, memberPhone, address } = intercept || {};
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }

    const currentName = intercept ? memberName : returnContact;
    const currentPhone = intercept ? memberPhone : returnPhone;
    const currentAddress = intercept ? address : returnAddress;
    return (
      <>
        <Modal
          title="修改地址"
          style={{ top: 20 }}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={() => this.setState({ visible: false })}
        >
          <Form  {...formItemLayout}>
            <Form.Item label="姓名">
              {getFieldDecorator("returnContact", {
                initialValue: currentName,
                rules: [{
                  required: true,
                  message: '请输入姓名'
                }]
              })(<Input placeholder="请输入姓名" />)}
            </Form.Item>
            <Form.Item label="手机号">
              {getFieldDecorator("returnPhone", {
                initialValue: currentPhone,
                rules: [{
                  required: true,
                  message: '请输入手机号'
                }]
              })(<Input placeholder="请输入手机号" maxLength={11} />)}
            </Form.Item>
            <Form.Item label="地址">
              {getFieldDecorator("returnAddress", {
                initialValue: currentAddress,
                rules: [{
                  required: true,
                  message: '请输入详细地址'
                }]
              })(<Input placeholder="请输入详细地址" />)}
            </Form.Item>
          </Form>
        </Modal>
        {`${currentName} ${currentPhone} ${currentAddress}`}
        <Button type="link" onClick={() => this.setState({ visible: true })}> 修改</Button>
      </>
    )
  }
}
export default Form.create<Props>()(ModifyReturnAddress);