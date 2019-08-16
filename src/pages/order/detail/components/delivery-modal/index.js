import React, { Component } from 'react';
import { Modal, Button, Input, Form, Row, Col } from 'antd';
import { deliveryChildOrder, updateLogisticsInfo, addLogisticsInfo } from '../../../api';
import ExpressCompanySelect from '@/components/express-company-select';

const FormItem = Form.Item;

let id = 0;

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
    const { onSuccess, orderId, form, data, logistics, mainorderInfo } = this.props;
    const fieldsValue = form.getFieldsValue();
    if (data && data.id) {
      return updateLogisticsInfo({
        id: data.id,
        expressCompanyName: fieldsValue.expressCompanyName,
        expressCode: fieldsValue.expressCode,
      }).then(() => {
        onSuccess && onSuccess();
        this.setState({
          visible: false,
        });
      });
    }
    
    if(logistics.orderPackageList && mainorderInfo.orderStatus > 20) {
      return addLogisticsInfo({
        childOrderId: orderId,
        expressCompanyName: fieldsValue.expressCompanyName,
        expressCode: fieldsValue.expressCode,
      }).then(() => {
        onSuccess && onSuccess();
        this.setState({
          visible: false,
        });
      });
    }

    const delivery = [fieldsValue.expressCompanyName + ',' + fieldsValue.expressCode];

    deliveryChildOrder({
      orderId,
      delivery,
    }).then(() => {
      onSuccess && onSuccess();
      this.setState({
        visible: false,
      });
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    let data = this.props.data;
    const { getFieldDecorator } = this.props.form;
    if (!data) data = {
      expressCompanyName: '',
      expressCode: '',
    }
    return (
      <>
        <Button type="link" onClick={this.showModal}>{this.props.title}</Button>
        <Modal
          title={this.props.title}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Row gutter={24}>
            <Col className="gutter-row" span={8}>
              快递公司
            </Col>
            <Col className="gutter-row" span={14}>
              快递单号
            </Col>
          </Row>
          <Form layout="vertical">
            <FormItem required={false}>
              <Row gutter={24}>
                <Col className="gutter-row" span={8}>
                  {getFieldDecorator(`expressCompanyName`, { initialValue: data.expressCompanyName })(
                    <ExpressCompanySelect placeholder="请选择快递公司" />,
                  )}
                </Col>
                <Col className="gutter-row" span={14}>
                  {getFieldDecorator(`expressCode`, { initialValue: data.expressCode })(<Input placeholder="请填写快递单号" />)}
                </Col>
                <Col className="gutter-row" span={2}>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(DeliveryDialog);
