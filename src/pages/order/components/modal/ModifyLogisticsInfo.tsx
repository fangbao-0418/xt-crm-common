import React from 'react';
import { message, Modal, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { withRouter, RouteComponentProps } from 'react-router';
import { formItemLayout } from '@/config';
import { namespace } from '../../refund/model';
import { customerUpdate } from '../../api';
interface Props extends FormComponentProps, RouteComponentProps<{ id: any }> {
  title: string;
  visible: boolean;
  onCancel: () => void;
  checkVO: AfterSalesInfo.CheckVO
}
class ModifyLogisticsInfo extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
  }
  async handleOk() {
    const params = this.props.form.getFieldsValue(['returnExpressCode', 'returnExpressName']);
    const res = await customerUpdate({
      id: this.props.match.params.id,
      ...params,
    });
    if (res) {
      const msg = this.props.checkVO.returnExpressCode ? '物流信息修改成功' : '物流信息上传成功';
      message.success(msg);
      APP.dispatch({
        type: `${namespace}/getDetail`,
        payload: { id: this.props.match.params.id },
      });
    }
    this.props.onCancel();
  };
  render(): React.ReactNode {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.props.onCancel}
      >
        <Form {...formItemLayout} className="login-form">
          <Form.Item label="物流公司">
            {getFieldDecorator('returnExpressName', {
              rules: [
                {
                  required: true,
                  message: '请输入物流公司',
                },
              ],
            })(<Input style={{ width: '100%' }} placeholder="请选择物流公司" />)}
          </Form.Item>
          <Form.Item label="物流单号 ">
            {getFieldDecorator('returnExpressCode', {
              rules: [
                {
                  required: true,
                  message: '请输入物流单号',
                },
              ],
            })(<Input placeholder="请输入物流单号" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default withRouter(Form.create<Props>()(ModifyLogisticsInfo));
