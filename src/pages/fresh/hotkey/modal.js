import React, { Component } from 'react';
import { Input, Form, Modal, InputNumber, message } from 'antd';
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

  state = {
    name: '',
    sort: ''
  }

  componentWillReceiveProps(nextProps) {
    if (this.id != nextProps.data.id) {
      this.id = nextProps.data.id;
      this.data = nextProps.data;
      this.setState({
        name: nextProps.data.name,
        sort: nextProps.data.sort
      })
    }
  }

  // componentDidMount() {
  //   const { form: {setFieldsValue} } = this.props;
  //   setFieldsValue({
  //     name: this.data.name || '',
  //     sort: this.data.sort || ''
  //   })
  // }

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
          type: 2,
          ...vals
        };
        if (this.id) params.id = this.id;
        (this.id ? updateInfo : saveInfo)(params).then(data => {
          if (data && data.id) {
            message.success('保存成功');
            this.props.close('reload');
          }
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
              initialValue: this.state.name,
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
              initialValue: this.state.sort,
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