import React from 'react';
import AfterSalesProcessing from './AfterSalesProcessing';
import AfterSaleApplyInfo from './components/AfterSaleApplyInfo';
import OrderInfo from './components/OrderInfo';

interface AfterSalesDetailProps {
  data: AfterSalesInfo.data
  getDetail: () => void
  refundId: number
}
interface AfterSalesDetailState {
  visible: boolean
}
class AfterSalesDetail extends React.Component<AfterSalesDetailProps, AfterSalesDetailState> {
  state: AfterSalesDetailState = {
    visible: false
  }
  render() {
    let { data: { orderInfoVO, orderServerVO, checkVO }, refundId, getDetail } = this.props;
    orderServerVO = Object.assign({}, orderServerVO)
    orderInfoVO = Object.assign({}, orderInfoVO)
    return (
      <>
        <AfterSalesProcessing />
        <AfterSaleApplyInfo orderServerVO={orderServerVO} />
        <OrderInfo orderInfoVO={orderInfoVO} />
      </>
    )
  }
}
export default AfterSalesDetail;