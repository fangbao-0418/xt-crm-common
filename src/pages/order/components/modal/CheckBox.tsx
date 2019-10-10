import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Form, Modal, Radio, Button, InputNumber, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, radioStyle } from '@/config';
import { namespace } from '../../refund/model';
import { enumRefundType } from '../../constant';
interface Props extends FormComponentProps, RouteComponentProps<{ id: any }> {
  checkVO: AfterSalesInfo.CheckVO;
}
interface State {
  visible: boolean;
}
class CheckExchange extends React.Component<Props, State> {
  state: State = {
    visible: false,
  };
  constructor(props: Props) {
    super(props);
    this.onOk = this.onOk.bind(this);
  }
  onOk() {
    this.props.form.validateFields((errors, values) => {
      if (values.serverNum == 0) {
        message.error('售后数目必须大于0');
        return;
      }
      if (!errors) {
        APP.dispatch({
          type: `${namespace}/auditOperate`,
          payload: {
            id: this.props.match.params.id,
            status: 1,
            refundType: enumRefundType.Exchange,
            ...values
          },
        });  
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const checkVO = this.props.checkVO || {};
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
                    message: '请选择处理方式'
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
                initialValue: checkVO.serverNum,
                rules: [
                  {
                    required: true,
                    message: '请输入换货数目'
                  },
                ],
              })(<InputNumber min={0} max={checkVO.maxServerNum} placeholder="请输入" />)}
              <span>（最多可售后数目{checkVO.maxServerNum}）</span>
            </Form.Item>
            <Form.Item label="说    明">
              {getFieldDecorator('info')(<Input.TextArea placeholder="请输入说明" autosize={{ minRows: 3, maxRows: 5 }} />)}
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
export default withRouter(Form.create<Props>()(CheckExchange));
