import React from 'react';
import { message, Modal, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { withRouter, RouteComponentProps } from 'react-router';
import { formItemLayout } from '@/config';
import { namespace } from '../../refund/model';
import { enumRefundType } from '../../constant'
import { ExpressCompanySelect } from '@/components';
interface Props extends FormComponentProps, RouteComponentProps<{ id: any }> {
  title: string;
  expressName?: string;
  expressCode?: string;
  visible: boolean;
  onCancel(): void;
  checkVO: AfterSalesInfo.CheckVO;
}
class PlatformDelivery extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
  }
  handleOk() {
    this.props.form.validateFields(async (errors, values) => {
      if (!errors) {
        APP.dispatch({
          type: `${namespace}/auditOperate`,
          payload: {
            id: this.props.match.params.id,
            refund: enumRefundType.Exchange,
            status: 1,
            ...values
          }
        });
      }
    });
  }
  render() {
    const { expressName, expressCode } = this.props;
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
            {getFieldDecorator('expressName', {
              initialValue: expressName,
              rules: [
                {
                  required: true,
                  message: '请输入物流公司',
                },
              ],
            })(<ExpressCompanySelect style={{ width: '100%' }} placeholder="请选择物流公司" />)}
          </Form.Item>
          <Form.Item label="物流单号 ">
            {getFieldDecorator('expressCode', {
              initialValue: expressCode,
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
export default withRouter(Form.create<Props>()(PlatformDelivery));
