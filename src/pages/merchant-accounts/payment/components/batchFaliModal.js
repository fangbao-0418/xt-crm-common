import React, { Component } from 'react';
import { Form, Modal, Button, Input, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
export default class extends Component {

  handlePayConfirm = () => {
    const {
      form: { validateFields },
      handleFailConfirm
    } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        console.log(vals)
        handleFailConfirm()
      }
    });
  }

  render() {
    const { modalProps = {}, form: { getFieldDecorator } } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    return (
      <Modal
        {...modalProps}
        title='批量支付'
        footer={null}
        destroyOnClose
      >
        <Form {...formItemLayout}>
          <FormItem label="失败原因">
            {getFieldDecorator('reason')(
              <TextArea
                placeholder="请输入失败原因，30字内"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            )}
          </FormItem>
          <FormItem label="发送短信">
            {getFieldDecorator('issend')(
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: '20px'
            }}
          >
            <Button
              type="primary"
              onClick={this.handlePayConfirm}
            >
              确认
            </Button>
          </div>
        </Form>
      </Modal>
    )
  }
}