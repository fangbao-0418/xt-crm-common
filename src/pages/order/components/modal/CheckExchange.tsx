import React from 'react';
import { Form, Modal, Radio, Button, InputNumber, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, radioStyle } from '@/config';
import { namespace } from '../../refund/model';
interface State {
  visible: boolean;
}
class CheckExchange extends React.Component<FormComponentProps, State> {
  state: State = {
    visible: false,
  };
  constructor(props: FormComponentProps) {
    super(props);
    this.onOk = this.onOk.bind(this);
  }
  onOk() {
    APP.dispatch
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <Modal
          title="处理结果"
          visible={this.state.visible}
          onOk={this.onOk}
          cancelText="返回"
          okText="提交"
          onCancel={() => this.setState({ visible: false })}
        >
          <Form {...formItemLayout}>
            <Form.Item label="处理方式">
              {getFieldDecorator('isAllow', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Radio.Group>
                  <Radio style={radioStyle} value={1}>
                    换货
                  </Radio>
                  <Radio style={radioStyle} value={0}>
                    拒绝换货
                  </Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="换货数目">
              {getFieldDecorator('serverNum', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<InputNumber min={1} placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="说    明">
              <Input.TextArea placeholder="请输入说明" autosize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
          </Form>
        </Modal>
        <Button type="primary" onClick={() => this.setState({ visible: true })}>
          处理结果
        </Button>
      </>
    );
  }
}
export default Form.create()(CheckExchange);
