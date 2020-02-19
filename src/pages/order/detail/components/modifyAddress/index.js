import React, { Component } from 'react';
import { Modal, Input, Form, Cascader } from 'antd';
import { formItemLayout } from '@/config';
import { deliveryChildOrder, updateLogisticsInfo } from '../../../api';
import CitySelect from '@/components/city-select'


class DeliveryDialog extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      selectedValues: null
    };
  }

  handleOk = e => {
    const { onSuccess, orderId, data, form: { validateFields } } = this.props;
    console.log(this.state.selectedValues, 'selectedValues');
    validateFields((errors, values) => {
      if (!errors) {
        console.log(values, 'values');
        if (data && data.id) {
          updateLogisticsInfo({
            id: data.id,
            expressCompanyName: values.expressCompanyName,
            expressCode: values.expressCode,
          }).then(() => {
            onSuccess && onSuccess();
          });
          return;
        }

        const delivery = [values.expressCompanyName + ',' + values.expressCode];

        deliveryChildOrder({
          orderId,
          delivery,
        }).then(() => {
          onSuccess && onSuccess();
        });
      }
    })
  };

  // 获取省市区选择值
  getSelectedValues = (selectedValues) => {
    this.setState({
      selectedValues
    })
  };

  render() {
    let { title, visible, onCancel, buyerInfo, form: { getFieldDecorator } } = this.props;
    const { memberAddress, phone, contact } = buyerInfo || {};
    const { provinceId, cityId, districtId, street } = memberAddress || {};
    return (
      <>
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleOk}
          onCancel={() => onCancel(false)}
        >
          <Form {...formItemLayout}>
            <Form.Item label="收件人">
              {getFieldDecorator(`contact`, {
                initialValue: contact,
                rules: [{
                  required: true,
                  message: '请填写收件人'
                }]
              })(
                <Input placeholder="请填写收件人" />,
              )}
            </Form.Item>
            <Form.Item label="手机号">
              {getFieldDecorator(`phone`, {
                initialValue: phone,
                rules: [{
                  required: true,
                  message: '请填写手机号'
                }]
              })(<Input placeholder="请填写手机号" />)}
            </Form.Item>
            <Form.Item label="所在地区">
            {getFieldDecorator(`Provinces`, {
                initialValue: [provinceId, cityId, districtId].map(id => String(id)),
                rules: [{
                  required: true,
                  message: '请选择所在地区'
                }]
              })(<CitySelect getSelectedValues={this.getSelectedValues}/>)}
            </Form.Item>
            <Form.Item label="详细地址">
              {getFieldDecorator(`street`, {
                initialValue: street,
                rules: [{
                  required: true,
                  message: '请填写详细地址'
                }]
              })(<Input placeholder="请填写详细地址" />)}
            </Form.Item>
          </Form>
          <div style={{textAlign: "center"}}>
            说明：用户付款1小时内可进行信息修改，超过1小时不可修改。
          </div>
        </Modal>
      </>
    );
  }
}

export default Form.create()(DeliveryDialog);
