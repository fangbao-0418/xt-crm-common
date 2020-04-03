import React from 'react';
import { Modal, Form, Input, Message } from 'antd';
import { formItemLayout } from '@/config';
import * as api from '../../api'
class RejectModal extends React.Component {

  handleOk = () => {
    const {
      id,
      form: { validateFields },
      handleSucc,
    } = this.props;
    validateFields((err, vals) => {
      if (err) return
      api.settlementReject({ id, remark: vals.remar }).then(res => {
        if (res) {
          Message.success('已提交');
          handleSucc()
        }
      })
    });
  }
  render() {
    const { modalProps = {}, form: { getFieldDecorator } } = this.props;
    return (
      <div>
        <Modal
          {...modalProps}
          onOk={this.handleOk}
          title="提示"
          destroyOnClose
        >
          <Form {...formItemLayout}>
            <Form.Item label="驳回原因" required>
              {getFieldDecorator('remark', {
                rules: [
                  {
                    required: true,
                    message: '请输入驳回原因',
                  },
                ]
              })(<Input.TextArea placeholder="请输入驳回原因" autosize={{ minRows: 3, maxRows: 5 }} />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(RejectModal);