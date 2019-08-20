import React, { Component } from 'react';
import { Input, Form, Modal, InputNumber } from 'antd';
import { saveInfo, updateInfo } from './api';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

export default class extends Component {
  onCancel = () => {

  }

  onOk = () => {

  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onCancel={this.onCancel}
        onOk={this.onOk}
        destroyOnClose
      >
        <Form {...formItemLayout}>
          <FormItem label="会员名称">
            <Input disabled />
          </FormItem>
          <FormItem label="会员账号">
            <Input disabled />
          </FormItem>
        </Form>
      </Modal>
    )
  }
}