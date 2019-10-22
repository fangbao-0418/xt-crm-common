import React from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form'
import CitySelect from '@/components/city-select'
interface State {
  visible: boolean;
}
interface Props extends FormComponentProps {
  detail: any;
  onSuccess(data: any): void;
}
class ModifyShippingAddress extends React.Component<Props, State> {
  state: State = {
    visible: false
  }
  private temp: any = {};
  constructor(props: Props) {
    super(props);
    this.getSelectedValues = this.getSelectedValues.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  // 获取选择值
  getSelectedValues(selectedValues: any[]) {
    const [{label: province, value: provinceId},{label: city, value: cityId},{label: district, value: districtId}] = selectedValues;
    this.temp = {
      province,
      provinceId,
      city,
      cityId,
      district,
      districtId
    }
  };
  handleOk() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.onSuccess(Object.assign(values, this.temp));
        this.setState({visible: false});
      }
    })
  }
  get address() {
    const {provinceId, cityId, districtId} = this.props.detail;
    return [provinceId, cityId, districtId].map(String)
  }
  render() {
    const { form: { getFieldDecorator }, detail: {returnContact, returnPhone, province, city, district, street} } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }
    return (
      <>
        <Modal
          title="修改地址"
          style={{ top: 20 }}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={() => this.setState({ visible: false })}
        >
          <Form  {...formItemLayout}>
            <Form.Item label="姓名">
              {getFieldDecorator("returnContact", {
                initialValue: returnContact,
                rules: [{
                  required: true,
                  message: '请输入姓名'
                }]
              })(<Input placeholder="请输入姓名" />)}
            </Form.Item>
            <Form.Item label="手机号">
              {getFieldDecorator("returnPhone", {
                initialValue: returnPhone,
                rules: [{
                  required: true,
                  message: '请输入手机号'
                }]
              })(<Input placeholder="请输入手机号" maxLength={11}/>)}
            </Form.Item>
            <Form.Item label="地址">
              {getFieldDecorator("address", {
                initialValue: this.address,
                rules: [{ required: true, message: "请选择城市选择" }]
              })(<CitySelect getSelectedValues={this.getSelectedValues} />)}
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              {getFieldDecorator("street", {
                initialValue: street,
                rules: [{
                  required: true,
                  message: '请输入详细地址'
                }]
              })(<Input placeholder="请输入详细地址" />)}
            </Form.Item>
          </Form>
        </Modal>
        {`${returnContact} ${returnPhone} ${province}${city}${district}${street}`}<Button type="link" onClick={() => this.setState({ visible: true })}> 修改</Button>
      </>
    )
  }
}
export default Form.create<Props>()(ModifyShippingAddress);