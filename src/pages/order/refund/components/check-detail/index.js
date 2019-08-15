import React from 'react';
import CustomerServiceReview from '../customer-service-review';
import ReturnInformation from '../return-information';
import DeliveryInformation from '../delivery-information';
import RefundInformation from '../refund-information';

function CheckDetail({checkVO = {}, orderServerVO = {}, checkType}) {
  // 仅退款
  if (orderServerVO.refundType === '20') {
    return <CustomerServiceReview checkVO={checkVO} orderServerVO={orderServerVO}/>
  } else {
    return (
      <>
        <CustomerServiceReview checkVO={checkVO} orderServerVO={orderServerVO}/>
        <ReturnInformation checkVO={checkVO} />
        {orderServerVO.refundType === '10' && <RefundInformation checkVO={checkVO} orderServerVO={orderServerVO} checkType={checkType} />}
        {orderServerVO.refundType === '30' && <DeliveryInformation checkVO= {checkVO} checkType={checkType} refundType={orderServerVO.refundType} />}
      </>
    );
  }
}
export default CheckDetail;