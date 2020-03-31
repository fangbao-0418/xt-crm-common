import React from 'react';
import { Modal, Form, Select, Message, Radio, InputNumber, Alert } from 'antd';
import If from '@/packages/common/components/if';
import { formItemLayout } from '@/config';
import * as api from '../../api'
class SettleModal extends React.Component {
  state = {
    payRateErr: false
  }

  handleOk = () => {
    const {
      id,
      form: { validateFields },
      handleSucc,
    } = this.props;
    const { payRateErr } = this.state;
    validateFields((err, values) => {
      if (err || payRateErr) return

      const { payMode, payTimes, payRate, payPeriod } = values

      let params = {
        id,
        payMode,
        payTimes: +payTimes
      };

      const rateKeys = ['firstRate', 'secondRate', 'thirdRate']

      if (payMode === 2) {
        params.payPeriod = payPeriod
        payRate.forEach((item, i) => {
          params[rateKeys[i]] = +item
        })
      }

      api.settlementSubmit(params).then(res => {
        console.log(res)
        if (res) {
          Message.success('已提交');
          handleSucc()
        }
      })
    });
  }

  // 切换付款类型的时候 需要重置付款次数的表单到初始值
  handlePayModTypeChange = () => {
    this.setState({
      payRateErr: false
    })
    this.props.form.setFieldsValue({
      payMode: '1'
    })
  }

  // 设置支付比例的时候失去焦点需要判断payRate之和等于100
  handlePayRateBlur = () => {
    const payRate = this.props.form.getFieldValue('payRate')
    if (payRate.some(item => [null, ''].includes(item))) return
    const sum = payRate.reduce((pre, next) => +pre + +next)
    if (sum === 100) {
      this.setState({
        payRateErr: false
      })
    } else {
      this.setState({
        payRateErr: true
      })
    }
  }

  handleAfterClose = () => {
    this.setState({
      payRateErr: false
    })
  }

  render() {
    const { modalProps = {}, form: { getFieldDecorator, getFieldValue } } = this.props;
    const { payRateErr } = this.state;

    let payMode = getFieldValue('payMode'),
      payTimes = +getFieldValue('payTimes');

    let formItems = null;

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 12, offset: 6 },
      },
    };

    if (payMode === 2) {
      getFieldDecorator('keys', {
        initialValue: [...Array(payTimes).keys()]
      });
      const keys = getFieldValue('keys');
      formItems = keys.map((k, index) => (
        <Form.Item
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '请设置支付比例' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`payRate[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: `第${index + 1}次输入比例`,
              },
            ],
            initialValue: keys.length === 1 ? '100' : ''
          })(
            <InputNumber
              min={1}
              onBlur={this.handlePayRateBlur}
              style={{ width: 180 }}
              disabled={keys.length === 1}
              placeholder={`第${index + 1}次输入比例`}
            />
          )}
          <span className="ant-form-text"> %</span>
        </Form.Item>
      ))
    }


    return (
      <div>
        <Modal
          {...modalProps}
          onOk={this.handleOk}
          title="提示"
          afterClose={this.handleAfterClose}
          destroyOnClose
        >
          <Form {...formItemLayout}>
            <Form.Item label="请设置付款类型">
              {getFieldDecorator('payMode', {
                initialValue: 1, rules: [
                  {
                    required: true,
                    message: '请设置付款类型',
                  },
                ],
              })(
                <Radio.Group onChange={this.handlePayModTypeChange}>
                  <Radio value={1}>系统默认</Radio>
                  <Radio value={2}>自定义</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="请设置付款次数">
              {getFieldDecorator('payTimes', {
                initialValue: '1', rules: [
                  {
                    required: true,
                    message: '请设置付款次数',
                  },
                ],
              })(
                <Select placeholder='请设置付款次数'>
                  <Select.Option key="1" value="1">一次付清</Select.Option>
                  <Select.Option key="2" value="2">分两次付清</Select.Option>
                  <Select.Option key="3" value="3">分三次付清</Select.Option>
                </Select>
              )}
            </Form.Item>
            <If condition={payMode === 2}>
              {formItems}
              <If condition={payRateErr}>
                <Form.Item {...formItemLayoutWithOutLabel}>
                  <Alert
                    message="支付比例总和需等于100"
                    type="error"
                  />
                </Form.Item>
              </If>
              <Form.Item label="请设置支付周期">
                {getFieldDecorator('payPeriod', {
                  rules: [
                    {
                      required: payMode === 2,
                      message: '请设置支付周期',
                    },
                  ],
                })(
                  <InputNumber precision={0} placeholder='请设置支付周期' style={{ width: 180 }} />
                )}
                <span className="ant-form-text"> 天</span>
              </Form.Item>
            </If>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(SettleModal);