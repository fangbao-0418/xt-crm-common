import React from 'react';
import { Input, Button, Form, Modal, Radio } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/lib/form'
import { formItemLayout, radioStyle } from '@/config';
import { namespace } from '../../refund/model';
interface Props extends FormComponentProps, RouteComponentProps<{ id: any }> { }
interface State {
  visible: boolean;
}
class OperatingFailed extends React.Component<Props, State> {
  state: State = {
    visible: false
  }
  constructor(props: Props) {
    super(props);
    this.handleRefund = this.handleRefund.bind(this);
  }
  handleRefund() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        let name = values.isAllow === 1 ? 'againRefund' : 'closeOrder';
        APP.dispatch({
          type: `${namespace}/${name}`,
          payload: {
            id: this.props.match.params.id,
            info: values.info
          }
        })
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <Modal
          title="处理退款"
          visible={this.state.visible}
          onOk={this.handleRefund}
          onCancel={() => this.setState({ visible: false })}>
          <Form {...formItemLayout}>
            <Form.Item label="处理方式">
              {getFieldDecorator('isAllow', {
                rules: [
                  {
                    required: true,
                    message: '请选择处理方式',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio style={radioStyle} value={1}>
                    重新退款
                  </Radio>
                  <Radio style={radioStyle} value={0}>
                    线下退款
                  </Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="说    明">
              {getFieldDecorator('info')(
                <Input.TextArea placeholder="请输入说明" autosize={{ minRows: 3, maxRows: 5 }} />,
              )}
            </Form.Item>
          </Form>
        </Modal>
        <Button type="primary" onClick={() => this.setState({ visible: true })}>处理退款</Button>
      </>
    )
  }
}
export default Form.create()(withRouter(OperatingFailed));