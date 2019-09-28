import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import CustomerProcessInfo from './components/CustomerProcessInfo';
import LogisticsInformation from './components/LogisticsInformation';
import SupplierProcessInfo from './components/SupplierProcessInfo';
interface WaitPlatformDeliveryState {
}
interface WaitPlatformDeliveryProps extends FormComponentProps {

}
/**
 * 待平台发货
 */
class WaitPlatformDelivery extends React.Component<WaitPlatformDeliveryProps, WaitPlatformDeliveryState>{
  render() {
    return (
      <>
        <CustomerProcessInfo /> 
        <LogisticsInformation />
        <SupplierProcessInfo />
      </>
    )
  }
}
export default WaitPlatformDelivery;