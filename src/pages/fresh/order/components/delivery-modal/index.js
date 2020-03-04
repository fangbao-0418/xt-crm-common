import React, { Component } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import { deliveryOrder } from '../../api';
import ExpressCompanySelect from '../../../../components/express-company-select';

const FormItem = Form.Item;

class DeliveryDialog extends Component {
  static defaultProps = {
    orderCode: '',
    onSuccess: () => {},
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
    console.log(e);
    const { onSuccess, orderCode, form } = this.props;

    deliveryOrder({
      orderCode,
      ...form.getFieldsValue(),
    }).then(() => {
      onSuccess && onSuccess();
      this.setState({
        visible: false,
      });
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleInputChange = e => {
    console.log('input value', e);
    this.setState({
      remark: e.target.value,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Button type={this.props.buttonType} onClick={this.showModal}>
          发货
        </Button>
        <Modal
          title="发货"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form layout="vertical">
            <FormItem label="快递公司">
              {getFieldDecorator('expressCompanyName')(
                <ExpressCompanySelect placeholder="请选择快递公司" />,
              )}
            </FormItem>
            <FormItem label="快递单号">
              {getFieldDecorator('expressCode')(<Input placeholder="请输入快递单号" />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(DeliveryDialog);
