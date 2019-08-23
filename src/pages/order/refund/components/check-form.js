import React, { Component } from 'react';
import { Card, Form, Input, InputNumber, Button } from 'antd';
import { formItemLayout, formButtonLayout } from '@/config';
import { withRouter } from 'react-router-dom';
import refundType from '@/enum/refundType';
import { XtSelect } from '@/components'
import { connect } from '@/util/utils';
import ReturnAddress from './return-address';
import { formatPrice } from '@/util/format';
import { formatMoney, isPendingStatus, isRefundFailedStatus } from '@/pages/helper';
import returnShipping from './return-shipping';
import { Decimal } from 'decimal.js';
@connect(state => ({
  data: state['refund.model'].data || {}
}))
@withRouter
class CheckForm extends Component {
  state = {
    returnAddress: {},
    refundType: ''
  }
  handleAuditOperate = (status) => {
    const { props } = this;
    const fieldsValue = props.form.getFieldsValue();
    if (fieldsValue.refundAmount) {
      fieldsValue.refundAmount = new Decimal(fieldsValue.refundAmount).mul(100).toNumber();
    }
    if (fieldsValue.isRefundFreight === undefined) {
      fieldsValue.isRefundFreight = this.props.checkVO.isRefundFreight;
    }
    let returnAddress = {}
    if (status === 1) {
      returnAddress = this.state.returnAddress;
    }
    console.log('this.state.returnAddress => ', this.state.returnAddress);
    props.dispatch['refund.model'].auditOperate({
      id: props.match.params.id,
      status,
      ...returnAddress,
      ...fieldsValue
    })
  }
  // 重新退款
  handleAgainRefund = async () => {
    const { dispatch, match: { params } } = this.props;
    dispatch['refund.model'].againRefund(params);
  }
  // 关闭订单
  async handleCloseOrder() {
    const { dispatch, match: { params } } = this.props;
    dispatch['refund.model'].closeOrder(params);
  }
  setReturnAddress = (returnAddress) => {
    this.setState({ returnAddress })
  }
  handleChange = (val) => {
    this.setState({ refundType: val })
  }
  // 是否退运费
  isReturnShipping() {
    const { data: { checkVO = {}, orderServerVO = {}, orderInfoVO = {} } } = this.props;
    const { refundAmount } = this.props.form.getFieldsValue(['refundAmount'])
    const hasFreight = checkVO.freight > 0;
    // 是否触发退运费的逻辑
    const isTrigger = (refundAmount * 100) + checkVO.freight + orderServerVO.alreadyRefundAmount === orderInfoVO.payMoney
    return hasFreight && isTrigger;
  }
  render() {
    const { orderServerVO = {}, checkVO = {}, refundStatus } = this.props;
    const { getFieldDecorator } = this.props.form;
    const localRefundType = this.state.refundType || orderServerVO.refundType;
    return (
      <Card title="客服审核">
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="售后类型">
            {getFieldDecorator('refundType', {
              initialValue: orderServerVO.refundType
            })(<XtSelect data={refundType.getArray()} placeholder="请选择售后类型" onChange={this.handleChange} />)}
          </Form.Item>
          {localRefundType === '20' && <Form.Item label="退款金额">
            {getFieldDecorator('refundAmount', {
              initialValue: formatPrice(checkVO.refundAmount)
            })(<InputNumber min={0.01} max={formatMoney(orderServerVO.productVO && orderServerVO.productVO[0] && orderServerVO.productVO[0].dealTotalPrice)} formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: '100%' }} />)}
          </Form.Item>}
          {
            this.isReturnShipping() && <Form.Item label="退运费">
              {getFieldDecorator('isRefundFreight', { initialValue: checkVO.isRefundFreight })(returnShipping(checkVO))}
            </Form.Item>
          }
          <Form.Item label="说明">
            {getFieldDecorator('info', {
            })(<Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
          </Form.Item>
          {/* 退货退款、换货才有退货地址 refundType： 10 30*/}
          {localRefundType !== '20' && <Form.Item label="退货地址"><ReturnAddress {...checkVO} setReturnAddress={this.setReturnAddress} /></Form.Item>}
          {
            // 待审核状态显示同意和拒绝按钮
            isPendingStatus(refundStatus) && (
              <Form.Item wrapperCol={formButtonLayout}>
                <Button type="primary" onClick={() => this.handleAuditOperate(1)}>同意</Button>
                <Button type="danger" style={{ marginLeft: '20px' }} onClick={() => this.handleAuditOperate(0)}>拒绝</Button>
              </Form.Item>
            )
          }
          {
            // 退款失败状态下显示重新退款和售后完成按钮
            isRefundFailedStatus(refundStatus) && (
              <Form.Item wrapperCol={formButtonLayout}>
                <Button type="primary" onClick={this.handleAgainRefund}>重新退款</Button>
                <Button type="danger" style={{ marginLeft: '20px' }} onClick={this.handleCloseOrder}>售后完成</Button>
              </Form.Item>
            )
          }
        </Form>
      </Card>
    )
  }
}

export default Form.create()(CheckForm);