import React from 'react';
import { message, Modal, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { withRouter, RouteComponentProps } from 'react-router';
import { formItemLayout } from '@/config';
import { namespace } from '../../refund/model';
import { customerUpdate, updateLogisticsInfo } from '../../api';
import ExpressCompanySelect from '@/components/express-company-select'
interface Props extends FormComponentProps, RouteComponentProps<{ id: any }> {
  title: string;
  type?: string;
  expressName?: string;
  expressCode?: string;
  sendExpressId?: string;
  visible: boolean;
  onCancel(): void;
}
class ModifyLogisticsInfo extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
  }
  handleOk() {
    this.props.form.validateFields(async (errors, values) => {
      if (!errors) {
        let res = null;
        if (this.props.type === 'platform') {
          res = await updateLogisticsInfo({
            id: this.props.sendExpressId,
            skuServerId: this.props.match.params.id,
            expressCode: values.expressCode,
            expressCompanyName: values.expressName
          })
        } else {
          res = await customerUpdate({
            id: this.props.match.params.id,
            returnExpressCode: values.expressCode,
            returnExpressName: values.expressName
          });
        } 
        if (res) {
          const msg = this.props.expressCode ? '物流信息修改成功' : '物流信息上传成功';
          message.success(msg);
          APP.dispatch({
            type: `${namespace}/getDetail`,
            payload: { id: this.props.match.params.id },
          });
        }
        this.props.onCancel();
      }
    })
  };
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
export default withRouter(Form.create<Props>()(ModifyLogisticsInfo));
