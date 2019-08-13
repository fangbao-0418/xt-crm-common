import React, { Component } from "react";
// import { Card } from 'antd';
import CustomerServiceReview from '../customer-service-review';
import ReturnInformation from '../return-information';
import DeliveryInformation from '../delivery-information';
import RefundInformation from '../refund-information';

class DealForm extends Component {
  render() {
    const { checkVO = {}, refundStatus, orderServerVO = {} } = this.props;
    return (
      <>
        <CustomerServiceReview checkVO={checkVO} refundStatus={refundStatus}/>
        <ReturnInformation checkVO={checkVO} />
        {orderServerVO.refundType === '10' && <RefundInformation readOnly={false}/>}
        {orderServerVO.refundType === '30' && <DeliveryInformation readOnly={false} />}
      </>
    )
  }
}
export default DealForm