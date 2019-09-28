import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import CustomerProcessInfo from './components/CustomerProcessInfo';
import LogisticsInformation from './components/LogisticsInformation';
import SupplierProcessInfo from './components/SupplierProcessInfo';
import RefundInformation from './components/RefundInformation';
interface RefundingState {
}
interface RefundingProps extends FormComponentProps {

}
/**
 * @description 退款中
 */
class Refunding extends React.Component<RefundingProps, RefundingState> {
  render() {
    return (
      <>
        <CustomerProcessInfo />
        {
          <>
            <LogisticsInformation />
            <SupplierProcessInfo />
          </>
        }
        <RefundInformation />
      </>
    )
  }
}
export default Refunding;