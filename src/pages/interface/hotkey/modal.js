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

class Edit extends Component {

  componentWillReceiveProps(nextProps) {
    if(this.id != nextProps.data.id) {
      this.id = nextProps.data.id;
      const { form: {setFieldsValue} } = this.props;
      setFieldsValue({
        name: nextProps.data.name || '',
        sort: nextProps.data.sort || ''
      })
    }
  }

  onCancel = () => {
    this.props.close();
  }

  onOk = () => {
    const {
      form: { validateFields }
    } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        const params = {
          ...vals,
        };
        if(this.id) params.id = this.id;
        (this.id ? updateInfo : saveInfo)(params, id => {
         
        });
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Modal
        visible={this.props.visible}
        onCancel={this.onCancel}
        onOk={this.onOk}
        destroyOnClose
      >
        <Form {...formItemLayout}>
          <FormItem label="热词名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入热词名称',
                },
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="排序">
            {getFieldDecorator('sort', {
              rules: [
                {
                  required: true,
                  message: '请输入排序',
                },
              ]
            })(<Input type="number" />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(Edit);