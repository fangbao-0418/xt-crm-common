import React, { Component } from "react";
import { Form, Button, Input } from 'antd';
import CustomerServiceReview from '../customer-service-review';
import ReturnInformation from '../return-information';
import DeliveryInformation from '../delivery-information';
import RefundInformation from '../refund-information';
import { formButtonLayout } from '@/config';
import { connect } from "@/util/utils";

@connect(state => ({
  data: state['refund.model'].data || {}
}))
@Form.create({'name': 'deal-form'})
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
    const { checkVO = {}, form: {getFieldDecorator}, data: {refundStatus, orderServerVO = {}} } = this.props;
    // 仅退款
    if (orderServerVO.refundType === '20') {
      if (refundStatus === '21') {
        return (
          <Form>
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
        )
      } else {
        return null;
      }
    } else {
      return (
        <>
          <CustomerServiceReview checkVO={checkVO} refundStatus={refundStatus} />
          <ReturnInformation checkVO={checkVO} />
          {/* 退货退款 */}
          {orderServerVO.refundType === '10' && <RefundInformation readOnly={false} />}
          {/* 仅换货 */}
          {orderServerVO.refundType === '30' && <DeliveryInformation readOnly={false} />}
        </>
      )
    }
  }
}
export default DealForm