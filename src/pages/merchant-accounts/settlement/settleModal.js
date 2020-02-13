import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
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
        console.log(vals.reason)
        if (operateType === 'submit') {
          // api.settlementSubmit(id)
        } else if (operateType === 'reject') {
          // api.settlementReject(id)
        }
        handleSucc()
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
                <Form.Item label="请设置付款次数" required>
                  {getFieldDecorator('reason', { initialValue: '' })(
                    <Select allowClear placeholder='请设置付款次数'>
                      <Select.Option key="" value="">一次付清</Select.Option>
                      <Select.Option key="0" value="0">分两次付清</Select.Option>
                      <Select.Option key="1" value="1">分三次付清</Select.Option>
                    </Select>
                  )}
                </Form.Item>
                : <Form.Item label="驳回原因" required>
                  {getFieldDecorator('reason', {})(<Input.TextArea placeholder="请输入驳回原因" autosize={{ minRows: 3, maxRows: 5 }} />)}
                </Form.Item>
            }

          </Form>

        </Modal>
      </div>
    );
  }
}
export default Form.create()(SettleModal);