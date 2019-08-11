import React, { Component } from 'react';
import { Card, Form, Select, Input, Button, Radio } from 'antd';
import refundType from '@/enum/refundType'
const { Option } = Select;
const { TextArea } = Input;
class CheckForm extends Component {
  state = {
    returnContact: '',
    returnPhone: '',
    returnAddress: '',
    checkType: ''
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSelectChange = (val) => {
    this.setState({
      checkType: val
    })
  }
  render() {
    const { orderServerVO = {}, checkVO = {}, onAuditOperate } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { returnContact, returnPhone, returnAddress, checkType} = this.state;
    return (
      <Card title="客服审核">
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
          <Form.Item label="售后类型">
            {getFieldDecorator('refundType', {
              initialValue: orderServerVO.refundType
            })(
              <Select
                placeholder="请选择售后类型"
                onChange={this.handleSelectChange}
              >
                {
                  refundType.getArray().map(v => <Option value={v.key} key={v.key}>{v.val}</Option>)
                }
              </Select>
            )}
          </Form.Item>
          {checkType !== '30' && <Form.Item label="退款金额">
            {getFieldDecorator('refundAmount', {
              initialValue: checkVO.refundAmount
            })(<Input />)}
          </Form.Item>}
          <Form.Item label="说明">
            {getFieldDecorator('info', {
            })(<TextArea
              placeholder=""
              autosize={{ minRows: 2, maxRows: 6 }}
            />)}
          </Form.Item>
          {checkType !== '20' && <Form.Item label="退货地址">
            <Radio.Group defaultValue={1} onChange={this.hanleChange}>
              <Radio value={1}>{checkVO.returnContact + ' ' + checkVO.returnPhone + ' ' + checkVO.returnAddress}</Radio>
              <Radio value={2}>
                <Input.Group>
                  <input name="returnContact" value={returnContact} placeholder="收货人姓名" onChange={this.handleChange}/>
                  <input name="returnPhone" value={returnPhone} placeholder="收货人电话" onChange={this.handleChange}/>
                  <input name="returnAddress" value={returnAddress} placeholder="收货人详细地址" onChange={this.handleChange}/>
                </Input.Group>
              </Radio>
            </Radio.Group>
          </Form.Item>}
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <Button type="primary" onClick={() => onAuditOperate(1)}>
              同意
            </Button>
            <Button type="danger" style={{ marginLeft: '20px' }} onClick={() => onAuditOperate(0)}>
              拒绝
            </Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create({ name: 'check-form' })(CheckForm);