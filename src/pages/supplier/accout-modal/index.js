import React, { Component } from 'react';
import { Form, Modal, Button, Input } from 'antd';
import { addSupplierAccount } from '../api';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
@Form.create({ name: 'accout-modal' })
class AccoutModal extends Component {
  state = {
    visible: false
  }
  handleOk = () => {
    const params = this.props.form.getFieldsValue();
    if (!this.isFetch) {
      addSupplierAccount({
        ...params,
        supplierId: this.props.id
      })
    }
    this.isFetch = true;
  }
  handleCancel = () => {
    this.setState({visible: false})
  }
  createAccount = () => {
    this.setState({ visible: true });
  }
  render() {
    const { createable, name, initialValue, form: { getFieldDecorator } } = this.props;
    return (
      <>
        <Modal
          title={createable ? '创建账号' : '查看账号'}
          visible={this.state.visible}
          okText="保存"
          cancelText="取消"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form {...formItemLayout}>
            <Form.Item label="供应商名称">{name}</Form.Item>
            <Form.Item label="账号">
              {getFieldDecorator('supplierAccount', { initialValue, rules: [{ required: true }] })(<Input placeholder="请输入账号，仅支持数字及英文"/>)}
            </Form.Item>
            <Form.Item label="初始密码">
              {getFieldDecorator('password', { initialValue, rules: [{ required: true }] })(<Input placeholder="请输入6-16位初始密码"/>)}
            </Form.Item>
          </Form>
        </Modal>
        <Button className="ml10" type="primary" onClick={this.createAccount}>创建账号</Button>
        <Button className="ml10" type="primary">查看账号</Button>
      </>
    );
  }
}
export default AccoutModal;