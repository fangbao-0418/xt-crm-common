import React, { Component } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import { formItemLayout } from '@/config';
import { deliveryChildOrder, updateLogisticsInfo, addLogisticsInfo, deliveryInterceptOrder } from '../../../api';
import ExpressCompanySelect from '@/components/express-company-select';

class DeliveryDialog extends Component {
  static defaultProps = {
    orderId: '',
    onSuccess: () => { },
    buttonType: 'link',
  };
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    const { onSuccess, orderId, data, logistics, type, mainorderInfo, form: { validateFields } } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        if (type == 'add' && logistics.interceptorType == 10) {
          deliveryInterceptOrder({
            interceptOrderId: logistics.interceptorOrderRecordId,
            logisticsCode: values.expressCode,
            logisticsName: values.expressCompanyName
          }).then(() => {
            this.setState({
              visible: false
            }, () => {
              onSuccess && onSuccess();
            });
          })
          return;
        }


        if (data && data.id) {
          return updateLogisticsInfo({
            id: data.id,
            expressCompanyName: values.expressCompanyName,
            expressCode: values.expressCode,
          }).then(() => {
            this.setState({
              visible: false,
            }, () => {
              onSuccess && onSuccess();
            });
          });
        }

        if (logistics.orderPackageList && mainorderInfo.orderStatus > 20) {
          return addLogisticsInfo({
            childOrderId: orderId,
            expressCompanyName: values.expressCompanyName,
            expressCode: values.expressCode,
          }).then(() => {
            this.setState({
              visible: false,
            }, () => {
              onSuccess && onSuccess();
            });
          });
        }

        const delivery = [values.expressCompanyName + ',' + values.expressCode];

        deliveryChildOrder({
          orderId,
          delivery,
        }).then(() => {
          onSuccess && onSuccess();
          this.setState({
            visible: false,
          });
        });
      }
    })
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    let { title, visible, onCancel, data } = this.props;
    const { getFieldDecorator } = this.props.form;
    if (!data) data = {
      expressCompanyName: '',
      expressCode: '',
    }
    return (
      <>
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleOk}
          onCancel={onCancel}
        >
          <Form {...formItemLayout}>
            <Form.Item label="快递公司">
              {getFieldDecorator(`expressCompanyName`, {
                initialValue: data.expressCompanyName,
                rules: [{
                  required: true,
                  message: '请选择快递公司'
                }]
              })(
                <ExpressCompanySelect style={{ width: '100%' }} placeholder="请选择快递公司" />,
              )}
            </Form.Item>
            <Form.Item label="快递单号">
              {getFieldDecorator(`expressCode`, {
                initialValue: data.expressCode,
                rules: [{
                  required: true,
                  message: '请填写快递单号'
                }]
              })(<Input placeholder="请填写快递单号" />)}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(DeliveryDialog);
