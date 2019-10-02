import React from 'react';
import CheckForm from './check-form';
import DealForm from './deal-form';
import CheckDetail from './check-detail';
import { calcCurrent } from '@/pages/helper'
import AfterSaleDetailTitle from './components/AfterSaleDetailTitle';
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
    let { data: { isDelete, orderInfoVO, orderServerVO, refundStatus }, refundId, getDetail } = this.props;
    orderServerVO = Object.assign({}, orderServerVO)
    orderInfoVO = Object.assign({}, orderInfoVO)
    let current = isDelete === 1 ? 2 : calcCurrent(refundStatus);
    return (
      <>
        <AfterSaleDetailTitle refundId={refundId} orderInfoVO={orderInfoVO} orderServerVO={orderServerVO} getDetail={getDetail} />
        {current === 2 && <CheckDetail {...this.props.data} />}
        <AfterSaleApplyInfo orderServerVO={orderServerVO} />
        {current === 0 && <CheckForm />}
        {current === 1 && <DealForm {...this.props.data} />}
        <OrderInfo orderInfoVO={orderInfoVO} />
      </>
    )
  }
}
export default AfterSalesDetail;