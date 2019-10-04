import React from 'react';
import { Form, Modal, Radio, InputNumber, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form'
import { formItemLayout, radioStyle } from '@/config';
interface Props extends FormComponentProps {
  visible?: boolean
  handleCancel: any
}
class CheckExchange extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
  }
  handleOk() {

  }
  render(): React.ReactNode {
    return (
      <Modal
        title="处理结果"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.props.handleCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label="处理方式">
            <Radio.Group>
              <Radio style={radioStyle} value={1}>
                退运费
              </Radio>
              <Radio style={radioStyle} value={2}>
                拒绝退款
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="退货数目">
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item label="退款金额">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="退运费">
            <Radio.Group>
              <Radio style={radioStyle} value={1}>
                是（运费金额：¥15.00）
              </Radio>
              <Radio style={radioStyle} value={2}>
                否
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="说    明">
            <Input.TextArea
              placeholder="请输入说明"
              autosize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default Form.create<Props>()(CheckExchange);