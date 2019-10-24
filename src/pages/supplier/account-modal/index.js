import React, { Component } from 'react';
import { Form, Modal, Button, Input, message } from 'antd';
import { addSupplierAccount, resetStore } from '../api';
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
@Form.create({ name: 'account-modal' })
class AccountModal extends Component {
  state = {
    visible: false,
    loading: false
  }
  toggleVisible = (visible) => {
    this.setState({ visible })
  }
  // 重置密码
  resetAccount = async () => {
    this.setState({ loading: true })
    const res = await resetStore({
      id: this.props.supplierAccountId,
      supplierId: this.props.id
    });
    if (res) {
      this.successCb('重置密码成功');
    }
    this.setState({ loading: false })
  }
  // 创建供应商账号
  createAccount = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ loading: true })
        const params = this.props.form.getFieldsValue();
        const res = await addSupplierAccount({
          ...params,
          supplierId: this.props.id
        });

        if (res) {
          this.successCb('创建账号成功');
        }
        this.setState({ loading: false })
      }
    });
  }
  passwordValidator = (rule, value, callback) => {
    if (!value) {
      callback('初始密码不能为空');
    } else if (!/^.{6,16}$/.test(value)) {
      callback('请输入6-16位初始密码')
    } else {
      callback()
    }
  }
  accountValidator = (rule, value, callback) => {
    if (!value) {
      callback('账号不能为空');
    } else if (!/^[\dA-Za-z]+$/.test(value)) {
      callback('请输入账号，仅支持数字及英文');
    } else {
      callback();
    }
  }
  successCb(msg) {
    this.props.onSuccess();
    message.success(msg);
    this.setState({ visible: false });
  }

  render() {
    const { supplierAccountId, supplierAccount, name, form: { getFieldDecorator } } = this.props;
    return supplierAccountId ? <>
      <Modal
        title="查看账号"
        visible={this.state.visible}
        footer={null}
        onCancel={() => this.toggleVisible(false)}
      >
        <Form {...formItemLayout}>
          <Form.Item label="供应商名称">{name}</Form.Item>
          <Form.Item label="账号">{supplierAccount}</Form.Item>
          <Form.Item label="密码">
            <Button type="primary" loading={this.state.loading} onClick={this.resetAccount}>重置</Button>
            <p>（密码重置以后将以短信形式发送至联系人手机）</p>
          </Form.Item>
        </Form>
      </Modal>
      <Button className="ml10" type="primary" onClick={() => this.toggleVisible(true)}>查看账号</Button>
    </> : <>
        <Modal
          title="创建账号"
          visible={this.state.visible}
          onCancel={() => this.toggleVisible(false)}
          footer={[
            <Button key="back" onClick={() => this.toggleVisible(false)}>
              取消
              </Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.createAccount}>
              保存
              </Button>,
          ]}
        >
          <Form {...formItemLayout}>
            <Form.Item label="供应商名称">{name}</Form.Item>
            <Form.Item label="账号">{getFieldDecorator('supplierAccount', { rules: [{validator: this.accountValidator}] })(<Input placeholder="请输入账号，仅支持数字及英文" maxLength={30}/>)}</Form.Item>
            <Form.Item label="初始密码">
              {getFieldDecorator('password', { rules: [{validator: this.passwordValidator}] })(<Input.Password placeholder="请输入6-16位初始密码" autoComplete='new-password' maxLength={16}/>)}
            </Form.Item>
          </Form>
        </Modal>
        <Button className="ml10" type="primary" onClick={() => this.toggleVisible(true)}>创建账号</Button>
      </>
  }
}
export default AccountModal;