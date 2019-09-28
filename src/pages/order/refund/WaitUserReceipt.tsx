import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import CustomerProcessInfo from './components/CustomerProcessInfo';
import LogisticsInformation from './components/LogisticsInformation';
import SupplierProcessInfo from './components/SupplierProcessInfo';
interface WaitPlatformShipState {
}
interface WaitPlatformShipProps extends FormComponentProps {

}
class WaitPlatformShip extends React.Component<WaitPlatformShipProps, WaitPlatformShipState> {
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
export default WaitPlatformShip;