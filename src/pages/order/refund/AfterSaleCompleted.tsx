import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import CustomerProcessInfo from './components/CustomerProcessInfo';
import LogisticsInformation from './components/LogisticsInformation';
import SupplierProcessInfo from './components/SupplierProcessInfo';
import RefundInformation from './components/RefundInformation';
interface AfterSaleCompletedState {
}
interface AfterSaleCompletedProps extends FormComponentProps {

}
/**
 * @description 售后完成
 */
class AfterSaleCompleted extends React.Component<AfterSaleCompletedProps, AfterSaleCompletedState>{
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
export default AfterSaleCompleted;