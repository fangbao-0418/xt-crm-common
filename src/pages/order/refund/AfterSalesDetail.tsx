import React from 'react';
import { connect } from 'react-redux';
import AfterSalesProcessing from './AfterSalesProcessing';
import AfterSaleApplyInfo from './components/AfterSaleApplyInfo';
import OrderInfo from './components/OrderInfo';
import { namespace } from './model';
interface AfterSalesDetailProps {
  data: AfterSalesInfo.data
}
interface AfterSalesDetailState {
  visible: boolean
}
class AfterSalesDetail extends React.Component<AfterSalesDetailProps, AfterSalesDetailState> {
  state: AfterSalesDetailState = {
    visible: false
  }
  render() {
    let { data } = this.props;
    return (
      <>
        <AfterSalesProcessing data={data}/>
        <AfterSaleApplyInfo orderServerVO={data.orderServerVO} />
        <OrderInfo orderInfoVO={data.orderInfoVO} />
      </>
    )
  }
}
export default connect((state: any) => {
  return {
    data: state[namespace] && state[namespace].data || {}
  }
})(AfterSalesDetail);;

