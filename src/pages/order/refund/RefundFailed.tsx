import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import CustomerProcessInfo from './components/CustomerProcessInfo';
import LogisticsInformation from './components/LogisticsInformation';
import SupplierProcessInfo from './components/SupplierProcessInfo';
import RefundInformation from './components/RefundInformation';
interface RefundFailedState {
}
interface RefundFailedProps extends FormComponentProps {

}
/**
 * @description 退款失败
 */
class RefundFailed extends React.Component<RefundFailedProps, RefundFailedState> {
  render() {
    return (
      <>
        <CustomerProcessInfo />
        <LogisticsInformation />
        <SupplierProcessInfo />
        <RefundInformation />
      </>
    )
  }
}
export default RefundFailed;