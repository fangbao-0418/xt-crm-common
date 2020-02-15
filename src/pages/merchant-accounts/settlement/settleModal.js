import React from 'react';
import { Modal, Form, Input, Select, Message } from 'antd';
import { formItemLayout } from '@/config';
import * as api from '../api'
class SettleModal extends React.Component {

  handleOk = () => {
    const {
      id,
      form: { validateFields },
      handleSucc,
      operateType
    } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        if (operateType === 'submit') {
          console.log(id, vals.payMod)
          api.settlementSubmit({ id, payMod: vals.payMod }).then(res => {
            console.log(res)
            if (res) {
              Message.success('已提交');
              handleSucc()
            }
          })
        } else if (operateType === 'reject') {
          api.settlementReject({ id, remark: vals.remar }).then(res => {
            console.log(res)
            if (res) {
              Message.success('已提交');
              handleSucc()
            }
          })
        }

      }
    });
  }
  render() {
    const { modalProps = {}, operateType, form: { getFieldDecorator } } = this.props;
    return (
      <div>
        <Modal
          {...modalProps}
          onOk={this.handleOk}
          title="提示"
        >
          <Form {...formItemLayout}>
            {
              operateType === 'submit'
                ?
                <Form.Item label="请设置付款次数">
                  {getFieldDecorator('payMod', {
                    initialValue: '1', rules: [
                      {
                        required: true,
                        message: '请设置付款次数',
                      },
                    ],
                  })(
                    <Select allowClear placeholder='请设置付款次数'>
                      <Select.Option key="1" value="1">一次付清</Select.Option>
                      <Select.Option key="2" value="2">分两次付清</Select.Option>
                      <Select.Option key="3" value="3">分三次付清</Select.Option>
                    </Select>
                  )}
                </Form.Item>
                : <Form.Item label="驳回原因" required>
                  {getFieldDecorator('remark', {
                    rules: [
                      {
                        required: true,
                        message: '请输入驳回原因',
                      },
                    ]
                  })(<Input.TextArea placeholder="请输入驳回原因" autosize={{ minRows: 3, maxRows: 5 }} />)}
                </Form.Item>
            }

          </Form>

        </Modal>
      </div>
    );
  }
}
export default Form.create()(SettleModal);