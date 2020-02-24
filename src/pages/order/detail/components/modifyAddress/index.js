import React, { Component } from 'react';
import { Modal, Input, Form, message } from 'antd';
import { formItemLayout } from '@/config';
import { modifyAddress } from '../../../api';
import CitySelect from '@/components/city-select'


class DeliveryDialog extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      selectedValues: null
    };
  }

  handleOk =  (channel) => {
    // channel用来判断是否校验运费，不传的话会校验，会有运费提高的净高，传3表示不校验更改地址。
    const _this = this;
    const { onCancel, form: { validateFields }, orderInfo: { id }, buyerInfo: { memberAddress } } = this.props;
    const { selectedValues } = this.state;
    validateFields((errors, values) => {
      if (!errors) {
        console.log(values, 'values');
        let { province, provinceId, cityId, city, districtId, district } = memberAddress || {};
        if(selectedValues){
          [{label: province, value: provinceId},{label: city, value: cityId},{label: district, value: districtId}] = selectedValues;
        }
        modifyAddress({
          mainOrderId: id,
          province,
          provinceId,
          cityId,
          city,
          districtId,
          district,
          id: memberAddress.id,
          channel,
          ...values,
        }).then(res => {
          const { code, success } = res;
          if(success){
            message.success('修改成功');
            return onCancel(true);
          } else if(code === "-2"){
            return Modal.error({
              title: res.message,
            });
          } else if(code === "-1"){
            return Modal.confirm({
              title: res.message,
              okText: '继续',
              onOk() {
                _this.handleOk(3);
              },
            });
          } 
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
          onOk={() => this.handleOk()}
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
                <Input allowClear placeholder="请填写收件人" />,
              )}
            </Form.Item>
            <Form.Item label="手机号">
              {getFieldDecorator(`phone`, {
                initialValue: phone,
                rules: [{
                  required: true,
                  len: 11,
                  message: '请填写手机号'
                }]
              })(<Input allowClear placeholder="请填写手机号" />)}
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
              })(<Input allowClear placeholder="请填写详细地址" />)}
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
