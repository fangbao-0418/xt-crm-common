import React from 'react';
import { calcCurrent } from '@/pages/helper'
import AfterSaleDetailTitle from './components/AfterSaleDetailTitle';
import AfterSaleApplyInfo from './components/AfterSaleApplyInfo';
import OrderInfo from './components/OrderInfo';
import CustomerProcessInfo from './components/CustomerProcessInfo';
import LogisticsInformation from './components/LogisticsInformation';
import SupplierProcessInfo from './components/SupplierProcessInfo';
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
    let { data: { isDelete, orderInfoVO, orderServerVO, refundStatus, checkVO }, refundId, getDetail } = this.props;
    orderServerVO = Object.assign({}, orderServerVO)
    orderInfoVO = Object.assign({}, orderInfoVO)
    let current = isDelete === 1 ? 2 : calcCurrent(refundStatus);
    return (
      <>
        <AfterSaleDetailTitle refundId={refundId} checkVO={checkVO} orderInfoVO={orderInfoVO} orderServerVO={orderServerVO} getDetail={getDetail} />
        <CustomerProcessInfo />
        <LogisticsInformation />
        <SupplierProcessInfo />
        <AfterSaleApplyInfo orderServerVO={orderServerVO} />
        <OrderInfo orderInfoVO={orderInfoVO} />
      </>
    )
  }
}
export default AfterSalesDetail;