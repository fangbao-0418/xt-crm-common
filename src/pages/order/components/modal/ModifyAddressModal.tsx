import React from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form'
import CitySelect from '@/components/city-select'
interface State {
  addressVisible: boolean;
  selectedValues: any[];
}
interface Props extends FormComponentProps {
  name: string;
  phone: string;
  address: string;
}
class ModifyAddress extends React.Component<Props, State> {
  public state = {
    addressVisible: false,
    selectedValues: []
  }
  public constructor(props: Props) {
    super(props);
    this.handleModifyAddress = this.handleModifyAddress.bind(this);
    this.getSelectedValues = this.getSelectedValues.bind(this);
  }
  public handleModifyAddress() {

  }
  // 获取选择值
  public getSelectedValues(selectedValues: any[]) {
    this.setState({
      selectedValues
    });
  };
  public render() {
    const { form: { getFieldDecorator }, name, phone, address } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }
    return (
      <>
        <Modal
          title="修改地址"
          style={{ top: 20 }}
          visible={this.state.addressVisible}
          onOk={() => this.handleModifyAddress()}
          onCancel={() => this.setState({ addressVisible: false })}
        >
          <Form  {...formItemLayout}>
            <Form.Item label="姓名">
              {getFieldDecorator("name", {
                initialValue: name
              })(<Input placeholder="请输入姓名" />)}
            </Form.Item>
            <Form.Item label="手机号">
              {getFieldDecorator("phone", {
                initialValue: phone
              })(<Input placeholder="请输入手机号" />)}
            </Form.Item>
            <Form.Item label="地址">
              {getFieldDecorator("address", {
                rules: [{ required: true, message: "请选择城市选择" }]
              })(<CitySelect getSelectedValues={this.getSelectedValues} />)}
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Input placeholder="请输入详细地址" />
            </Form.Item>
          </Form>
        </Modal>
        {name + ' ' + phone + ' ' + address} <Button type="link" onClick={() => this.setState({ addressVisible: true })}> 修改</Button>
      </>
    )
  }
}
export default Form.create()(ModifyAddress);