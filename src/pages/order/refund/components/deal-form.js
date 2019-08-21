import React, { Component } from "react";
import { Card, Row, Col, Form, Button, Input, InputNumber } from 'antd';
import { withRouter } from 'react-router-dom';
import { XtSelect } from '@/components'
import refundType from '@/enum/refundType';
import { formItemLayout, formButtonLayout } from '@/config';
import { connect } from "@/util/utils";
import {
  isOnlyRefund,
  isReturnOfGoodsAndMoney,
  isOnlyExchange,
  isReturnOfGoodsAndMoneyStatus,
  isRefundFailedStatus,
  isProcessingStatus,
  isInExchangeStatus,
  formatMoney,
  joinFilterEmpty,
  formatDate
} from '@/pages/helper';
import ExpressCompanySelect from '@/components/express-company-select';
import returnShipping from './return-shipping';
import { Decimal } from 'decimal.js';

@connect(state => ({
  data: state['refund.model'].data || {}
}))
@withRouter
@Form.create({ 'name': 'deal-form' })
class DealForm extends Component {
  // 重新退款
  handleAgainRefund = async () => {
    const { dispatch, match: { params }, form: { getFieldsValue } } = this.props;
    const fields = getFieldsValue(['info'])
    dispatch['refund.model'].againRefund({ ...params, ...fields });
  }
  // 关闭订单
  handleCloseOrder = async () => {
    const { dispatch, match: { params }, form: { getFieldsValue } } = this.props;
    const fields = getFieldsValue(['info']);
    dispatch['refund.model'].closeOrder({ ...params, ...fields });
  }
  // 第二次审核
  handleAuditOperate = (status) => {
    const { dispatch, match: { params: { id } }, form: { getFieldsValue } } = this.props;
    const fields = getFieldsValue();
    if (fields.refundAmount) {
      fields.refundAmount = new Decimal(fields.refundAmount).mul(100).toNumber();
    }
    if (fields.isRefundFreight === undefined) {
      fields.isRefundFreight = this.props.data.checkVO.isRefundFreight
    }
    dispatch['refund.model'].auditOperate({
      id,
      status,
      ...fields
    });
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
    const { form: { getFieldDecorator }, data: { refundStatus, orderServerVO = {}, checkVO = {} } } = this.props;
    // 仅退款
    if (isOnlyRefund(checkVO.refundType)) {
      // 退款失败
      if (isRefundFailedStatus(refundStatus)) {
        return (
          <>
            <Card title="审核信息">
              <Row>
                <Col>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
                <Col>说明：{checkVO.firstServerDescribe}</Col>
              </Row>
            </Card>
            <Card title="退款信息">
              <Form {...formItemLayout}>
                <Form.Item label="说明">
                  {getFieldDecorator('info', {
                  })(<Input.TextArea
                    placeholder=""
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />)}
                </Form.Item>
                <Form.Item wrapperCol={formButtonLayout}>
                  <Button type="primary" onClick={this.handleAgainRefund}>重新退款</Button>
                  <Button type="danger" style={{ marginLeft: '20px' }} onClick={this.handleCloseOrder}>售后完成</Button>
                </Form.Item>
              </Form>
            </Card>
          </>
        )
      } else {
        return null;
      }
    }
    // 仅换货、退款换货
    else {
      return (
        <>
          <Card title="审核信息">
            <Row>
              <Col>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
              <Col>说明：{checkVO.firstServerDescribe}</Col>
              {/* 退货退款和换货流程才有退款信息 */}
              {!isOnlyRefund(checkVO.refundType) && <Col>退货信息：{joinFilterEmpty([checkVO.returnContact, checkVO.returnPhone, checkVO.returnAddress])}</Col>}
            </Row>
          </Card>
          <Card title={<div>退货信息{isProcessingStatus(refundStatus) && <span style={{ color: '#999' }}>（待买家上传物流信息）</span>}</div>}>
            <Row>
              <Col>物流公司：{checkVO.returnExpressName || '--'}</Col>
              <Col>物流单号：{checkVO.returnExpressCode || '--'}</Col>
              <Col>提交时间：{(checkVO.returnExpressTime === 0 ? '' : formatDate(checkVO.returnExpressTime)) || '--'}</Col>
            </Row>
          </Card>
          {/* 处理中状态不显示， 待买家上传物流信息 */}
          {!isProcessingStatus(refundStatus) && (
            <>
              {/* 退货退款才显示退款信息 */}
              {isReturnOfGoodsAndMoney(checkVO.refundType) && (
                <Card title="退款信息">
                  <Form {...formItemLayout}>
                    {/* 退货退款中显示提交或者拒绝，这是第二步审核操作 */}
                    {isReturnOfGoodsAndMoneyStatus(refundStatus) && (
                      <>
                        <Form.Item label="退款类型">
                          {getFieldDecorator('refundType', {
                            initialValue: orderServerVO.refundType
                          })(<XtSelect placeholder="请选择退款类型" disabled data={refundType.getArray()} />)}
                        </Form.Item>
                        <Form.Item label="退款金额">
                          {getFieldDecorator('refundAmount', {
                            initialValue: formatMoney(checkVO.refundAmount)
                          })(<InputNumber min={0.01} max={formatMoney(orderServerVO.productVO && orderServerVO.productVO[0] && orderServerVO.productVO[0].dealTotalPrice)} formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: '100%' }} />)}
                        </Form.Item>
                        {this.isReturnShipping() && (
                          <Form.Item label="退运费">
                            {getFieldDecorator('isRefundFreight', { initialValue: checkVO.isRefundFreight })(returnShipping(checkVO))}
                          </Form.Item>
                        )}
                        <Form.Item label="说明">
                          {getFieldDecorator('info', {
                          })(<Input.TextArea
                            autosize={{ minRows: 2, maxRows: 6 }}
                          />)}
                        </Form.Item>
                        <Form.Item wrapperCol={formButtonLayout} style={{ marginBottom: 0 }}>
                          <Button type="primary" onClick={() => this.handleAuditOperate(1)}>提交</Button>
                          <Button type="danger ml20" onClick={() => this.handleAuditOperate(0)}>拒绝</Button>
                        </Form.Item>
                      </>
                    )}
                    {/* 退款失败显示重新退款或售后完成 */}
                    {isRefundFailedStatus(refundStatus) && (
                      <>
                        <Form.Item label="说明">
                          {getFieldDecorator('info', {
                          })(<Input.TextArea
                            placeholder=""
                            autosize={{ minRows: 2, maxRows: 6 }}
                          />)}
                        </Form.Item>
                        <Form.Item wrapperCol={formButtonLayout}>
                          <Button type="primary" onClick={this.handleAgainRefund}>重新退款</Button>
                          <Button type="danger" style={{ marginLeft: '20px' }} onClick={this.handleCloseOrder}>售后完成</Button>
                        </Form.Item>
                      </>
                    )}
                  </Form>
                </Card>
              )}
              {/* 换货流程才显示发货信息 */}
              {isOnlyExchange(checkVO.refundType) && (
                <Card title="发货信息">
                  <Form {...formItemLayout}>
                    <Form.Item label="物流公司">
                      {getFieldDecorator('expressName')(<ExpressCompanySelect style={{ width: '100%' }} placeholder="请选择物流公司" />)}
                    </Form.Item>
                    <Form.Item label="物流单号">
                      {getFieldDecorator('expressCode')(<Input placeholder="请输入物流单号" />)}
                    </Form.Item>
                    <Form.Item label="说明">
                      {getFieldDecorator('info', {
                      })(<Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
                    </Form.Item>
                    {/* 当用户上传的换货物流单号才显示提交或者拒绝，当前状态换货中 */}
                    {isInExchangeStatus(refundStatus) && (
                      < Form.Item wrapperCol={formButtonLayout} style={{ marginBottom: 0 }}>
                        <Button type="primary" onClick={() => this.handleAuditOperate(1)}>提交</Button>
                        <Button type="danger ml20" onClick={() => this.handleAuditOperate(0)}>拒绝</Button>
                      </Form.Item>
                    )}
                    {/* 换货肯定成功，所有没有失败的逻辑 */}
                  </Form>
                </Card>
              )}
            </>
          )}
        </>
      )
    }
  }
}
export default DealForm