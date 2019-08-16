import React, { Component } from 'react';
import { Card, Form, Input, InputNumber, Button, Row, Col } from 'antd';
import { formItemLayout, formButtonLayout } from '@/config'
import { XtSelect } from '@/components'
import refundType from '@/enum/refundType';
import { connect } from '@/util/utils';
import { withRouter } from 'react-router-dom';
import { formatMoney } from '@/pages/helper';
import returnShipping from './return-shipping';
@connect(state => ({
  data: state['refund.model'].data || {}
}))
@withRouter
@Form.create({ name: 'refund-information' })
class RefundInformation extends Component {
  handleAuditOperate = (status) => {
    const { dispatch, match: { params: { id } }, form: { getFieldsValue } } = this.props;
    const fields = getFieldsValue();
    fields.refundAmount = fields.refundAmount * 100;
    dispatch['refund.model'].auditOperate({
      id,
      status,
      ...fields
    });
  }
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
  render() {
    const { form: { getFieldDecorator }, data: { orderServerVO, checkVO, refundStatus }, readOnly = true } = this.props;
    if (readOnly) {
      return (
        <Card title="退款信息">
          <Row>
            <Col>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
            <Col>退款金额：￥{formatMoney(checkVO.refundAmount)}</Col>
            <Col>退运费：￥{formatMoney(checkVO.freight)	}</Col>
            <Col>说明：{checkVO.info}</Col>
          </Row>
        </Card>
      )
    } else {
      if (refundStatus === 21 || refundStatus === 22) {
        return (
          <Card title="退款信息">
            <Form {...formItemLayout}>
              {refundStatus === 22 && (
                <>
                  <Form.Item label="退款类型">
                    {getFieldDecorator('refundType', {
                      initialValue: orderServerVO.refundType
                    })(<XtSelect placeholder="请选择退款类型" disabled data={refundType.getArray()} />)}
                  </Form.Item>
                  <Form.Item label="退款金额">
                    {getFieldDecorator('refundAmount', {
                      initialValue: formatMoney(checkVO.refundAmount)
                    })(<InputNumber min={0.01} max={formatMoney(checkVO.refundAmount)} formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: '100%' }} />)}
                  </Form.Item>
                  {checkVO.isRefundFreight === 1 && <Form.Item label="退运费">
                    {getFieldDecorator('isRefundFreight', { initialValue: checkVO.isRefundFreight })(returnShipping(checkVO))}
                  </Form.Item>}
                  <Form.Item label="说明">
                    {getFieldDecorator('info', {
                    })(<Input.TextArea
                      placeholder=""
                      autosize={{ minRows: 2, maxRows: 6 }}
                    />)}
                  </Form.Item>
                  <Form.Item wrapperCol={formButtonLayout} style={{ marginBottom: 0 }}>
                    <Button type="primary" onClick={() => this.handleAuditOperate(1)}>提交</Button>
                    <Button type="danger ml20" onClick={() => this.handleAuditOperate(0)}>拒绝</Button>
                  </Form.Item>
                </>
              )}
              {refundStatus === 21 && <Form.Item wrapperCol={formButtonLayout}>
                <Button type="primary" onClick={this.handleAgainRefund}>重新退款</Button>
                <Button type="danger" style={{ marginLeft: '20px' }} onClick={this.handleCloseOrder}>关闭订单</Button>
              </Form.Item>}
            </Form>
          </Card>
        );
      } else {
        return null;
      }
    }
  }
}
export default RefundInformation;