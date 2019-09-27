import React, {Component} from 'react';
import { Button, Modal, Form, Input } from 'antd';
import CitySelect from '@/components/city-select'
@Form.create()
class ModifyAddress extends Component {
  state = {
    addressVisible: false
  }
  render() {
    const { getFieldDecorator } = this.props.form;
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
          onCancel={() => this.setState({addressVisible: false})}
        >
          <Form  {...formItemLayout}>
            <Form.Item label="姓名">
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item label="手机号">
              <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item label="地址">
              {getFieldDecorator("city", {
                rules: [{ message: "请选择城市选择" }]
              })(<CitySelect getSelectedValues={this.getSelectedValues} />)}
            </Form.Item>
            <Form.Item wrapperCol={{offset: 4}}>
              <Input placeholder="请输入详细地址"/>
            </Form.Item>
          </Form>
        </Modal>
        八宝  13644445555 杭州市余杭区欧美金融中心美国中心南楼 <Button type = "link" onClick = {() => this.setState({ addressVisible: true })}> 修改</Button>
      </>
    )
  }
}
export default ModifyAddress;