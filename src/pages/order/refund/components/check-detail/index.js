import React from 'react';
import CustomerServiceReview from '../customer-service-review';
import ReturnInformation from '../return-information';
import DeliveryInformation from '../delivery-information';
import RefundInformation from '../refund-information';

function CheckDetail({ checkVO = {}, orderServerVO = {}, checkType }) {
  return (
    <>
      <CustomerServiceReview checkVO={checkVO} orderServerVO={orderServerVO} />
      {orderServerVO.refundType !== '20' && <ReturnInformation checkVO={checkVO} />}
      {/* 退货退款、仅换货 */}
      {orderServerVO.refundType === '10' && <RefundInformation checkVO={checkVO} orderServerVO={orderServerVO} checkType={checkType} />}
      {orderServerVO.refundType === '30' && <DeliveryInformation checkVO={checkVO} checkType={checkType} refundType={orderServerVO.refundType} />}
    </>
  );
}
export default CheckDetail;