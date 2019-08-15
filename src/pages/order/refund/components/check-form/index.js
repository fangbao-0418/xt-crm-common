import React, { Component } from 'react';
import { Card, Form, Input, InputNumber, Button } from 'antd';
import { formButtonLayout } from '@/config';
import { withRouter } from 'react-router-dom';
import refundType from '@/enum/refundType';
import { XtSelect } from '@/components'
import { connect } from '@/util/utils';
import ReturnAddress from '../return-address';
import { formatPrice } from '@/util/format';
import { formatMoney } from '@/pages/helper';
import returnShipping from '../return-shipping';
@connect()
@withRouter
class CheckForm extends Component {
  state = {
    returnAddress: {}
  }
  handleAuditOperate = (status) => {
    const { props } = this;
    const fieldsValue = props.form.getFieldsValue();
    if (fieldsValue.refundAmount) {
      fieldsValue.refundAmount = fieldsValue.refundAmount * 100;
    }
    props.dispatch['refund.model'].auditOperate({
      id: props.match.params.id,
      status,
      ...this.state.returnAddress,
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
  render() {
    const { orderServerVO = {}, checkVO = {}, refundStatus } = this.props;
    const { getFieldDecorator } = this.props.form;
    const refundTypeForm = this.props.form.getFieldsValue(['refundType']);
    refundTypeForm.refundType = refundTypeForm.refundType || orderServerVO.refundType;
    return (
      <Card title="客服审核">
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
          <Form.Item label="售后类型">
            {getFieldDecorator('refundType', {
              initialValue: orderServerVO.refundType
            })(<XtSelect data={refundType.getArray()} placeholder="请选择售后类型" />)}
          </Form.Item>
          {refundTypeForm.refundType !== '30' && <Form.Item label="退款金额">
            {getFieldDecorator('refundAmount', {
              initialValue: formatPrice(checkVO.refundAmount)
            })(<InputNumber min={0.01} max={formatMoney(checkVO.refundAmount)} formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: '100%' }} />)}
          </Form.Item>}
          {
            checkVO.isRefundFreight === 1 && <Form.Item label="退运费">
              {getFieldDecorator('isRefundFreight', { initialValue: checkVO.isRefundFreight })(returnShipping(checkVO))}
            </Form.Item>
          }
          <Form.Item label="说明">
            {getFieldDecorator('info', {
            })(<Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
          </Form.Item>
          {/* 退货退款、换货才有退货地址 refundType： 10 30*/}
          {refundTypeForm.refundType !== '20' && <Form.Item label="退货地址"><ReturnAddress {...checkVO} setReturnAddress={this.setReturnAddress}/></Form.Item>}
          {
            refundStatus === 10 && <Form.Item
              wrapperCol={formButtonLayout}
            >
              <Button type="primary" onClick={() => this.handleAuditOperate(1)}>
                同意
            </Button>
              <Button type="danger" style={{ marginLeft: '20px' }} onClick={() => this.handleAuditOperate(0)}>
                拒绝
            </Button>
            </Form.Item>
          }
          {
            refundStatus === 21 && (
              <Form.Item wrapperCol={formButtonLayout}>
                <Button type="primary" onClick={this.handleAgainRefund}>重新退款</Button>
                <Button type="danger" style={{ marginLeft: '20px' }} onClick={this.handleCloseOrder}>关闭订单</Button>
              </Form.Item>
            )
          }
        </Form>
      </Card>
    )
  }
}

export default Form.create({ name: 'check-form' })(CheckForm);