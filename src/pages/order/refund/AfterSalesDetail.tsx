import React from 'react';
import { connect } from 'react-redux';
import AfterSalesProcessing from './AfterSalesProcessing';
import OrderInfo from './components/OrderInfo';
import PendingReview from './PendingReview';
import { namespace } from './model';
import { enumRefundStatus } from '../constant';
interface AfterSalesDetailProps {
  data: AfterSalesInfo.data;
}
interface AfterSalesDetailState {
  visible: boolean;
}
class AfterSalesDetail extends React.Component<AfterSalesDetailProps, AfterSalesDetailState> {
  state: AfterSalesDetailState = {
    visible: false,
  };
  isRefundStatusOf(refundStatus: number) {
    let orderServerVO = Object.assign({}, this.props.data.orderServerVO);
    return orderServerVO.refundStatus === refundStatus;
  }
  render() {
    let { data } = this.props;
    return (
      <>
        {this.isRefundStatusOf(enumRefundStatus.WaitConfirm) ? (
          <PendingReview />
        ) : (
          <AfterSalesProcessing data={data} />
        )}
        <OrderInfo orderInfoVO={data.orderInfoVO} />
      </>
    );
  }
}
export default connect((state: any) => {
  return {
    data: (state[namespace] && state[namespace].data) || {},
  };
})(AfterSalesDetail);
