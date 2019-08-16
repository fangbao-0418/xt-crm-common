import React, { Component } from "react";
import { Card, Form, Button, Input } from 'antd';
import { withRouter } from 'react-router-dom';
import CustomerServiceReview from '../customer-service-review';
import ReturnInformation from '../return-information';
import DeliveryInformation from '../delivery-information';
import RefundInformation from '../refund-information';
import { formItemLayout, formButtonLayout } from '@/config';
import { connect } from "@/util/utils";

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
  render() {
    const { form: { getFieldDecorator }, data: { refundStatus, orderServerVO = {}, checkVO = {} } } = this.props;
    // 仅退款
    if (orderServerVO.refundType === '20') {
      // 退款失败
      if (refundStatus == 21) {
        return (
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
                <Button type="danger" style={{ marginLeft: '20px' }} onClick={this.handleCloseOrder}>关闭订单</Button>
              </Form.Item>
            </Form>
          </Card>
        )
      } else {
        return null;
      }
    }
    // 仅换货、退款换货
    else {
      console.log('refundStatus~~~~~~~~~', refundStatus);
      return (
        <>
          <CustomerServiceReview checkVO={checkVO} refundStatus={refundStatus} />
          <ReturnInformation checkVO={checkVO} refundStatus={refundStatus} />
          {refundStatus != 20 && (
            <>
              {/* 退货退款 */ orderServerVO.refundType === '10' && <RefundInformation readOnly={false} />}
              {/* 仅换货 */ orderServerVO.refundType === '30' && <DeliveryInformation readOnly={false} />}
            </>
          )}
        </>
      )
    }
  }
}
export default DealForm