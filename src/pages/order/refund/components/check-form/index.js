import React, { Component } from 'react';
import { Card, Form, Input, InputNumber, Button, Radio } from 'antd';
import { formButtonLayout } from '@/config';
import { withRouter } from 'react-router-dom';
import refundType from '@/enum/refundType';
import { XtSelect } from '@/components'
import { connect } from '@/util/utils';
import { formatMoney } from '@/pages/helper';
@connect()
@withRouter
class CheckForm extends Component {
  state = {
    checkType: '',
    radioKey: 1,
    returnObj: {
      returnContact: '',
      returnPhone: '',
      returnAddress: ''
    }
  }
  hanleRadioChange = (event) => {
    console.log(event.target.value)
    this.setState({
      radioKey: event.target.value
    })
  }
  hangdleInputChange = (event) => {
    const { name, value } = event.target;
    const { returnObj } = this.state
    returnObj[name] = value;
    this.setState({
      returnObj
    })
  }
  handleAuditOperate = (status) => {
    const { props } = this;
    const fieldsValue = props.form.getFieldsValue();
    let returnObj;
    fieldsValue.refundAmount = fieldsValue.refundAmount * 100;
    if (this.state.radioKey === 1) {
      const { returnContact, returnPhone, returnAddress } = this.props.checkVO
      returnObj = { returnContact, returnPhone, returnAddress }
    } else {
      returnObj = this.state.returnObj
    }
    props.dispatch['refund.model'].auditOperate({
      id: props.match.params.id,
      status,
      ...returnObj,
      ...fieldsValue
    })
  }
  render() {
    const { orderServerVO = {}, checkVO = {} } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { checkType } = this.state;
    return (
      <Card title="客服审核">
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
          <Form.Item label="售后类型">
            {getFieldDecorator('refundType', {
              initialValue: orderServerVO.refundType
            })(<XtSelect data={refundType.getArray()} placeholder="请选择售后类型" onChange={this.handleSelectChange} />)}
          </Form.Item>
          {checkType !== '30' && <Form.Item label="退款金额">
            {getFieldDecorator('refundAmount', {
              initialValue: formatMoney(checkVO.refundAmount)
            })(<InputNumber formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{width: '100%'}}/>)}
          </Form.Item>}
          <Form.Item label="说明">
            {getFieldDecorator('info', {
            })(<Input.TextArea
              placeholder=""
              autosize={{ minRows: 2, maxRows: 6 }}
            />)}
          </Form.Item>
          {checkType !== '20' && <Form.Item label="退货地址">
            <Radio.Group value={this.state.radioKey} onChange={this.hanleRadioChange}>
              <Radio value={1}>{checkVO.returnContact + ' ' + checkVO.returnPhone + ' ' + checkVO.returnAddress}</Radio>
              <Radio value={2}>
                <Input.Group compact={true}>
                  <input placeholder="收货人姓名" name="returnContact" value={this.state.returnObj.returnContact} onChange={this.hangdleInputChange} />
                  <input placeholder="收货人电话" name="returnPhone" value={this.state.returnObj.returnPhone} onChange={this.hangdleInputChange} />
                  <input placeholder="收货人详细地址" name="returnAddress" value={this.state.returnObj.returnAddress} onChange={this.hangdleInputChange} />
                </Input.Group>
              </Radio>
            </Radio.Group>
          </Form.Item>}
          <Form.Item
            wrapperCol={formButtonLayout}
          >
            <Button type="primary" onClick={() => this.handleAuditOperate(1)}>
              同意
            </Button>
            <Button type="danger" style={{ marginLeft: '20px' }} onClick={() => this.handleAuditOperate(0)}>
              拒绝
            </Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create({ name: 'check-form' })(CheckForm);