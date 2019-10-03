import React from 'react';
import { Card } from 'antd';
import { connect } from 'react-redux';
import AfterSaleDetailTitle from './components/AfterSaleDetailTitle';
import CustomerProcessInfo from './components/CustomerProcessInfo';
import LogisticsInformation from './components/LogisticsInformation';
import SupplierProcessInfo from './components/SupplierProcessInfo';
import { namespace } from './model';
interface Props {
  data: AfterSalesInfo.data;
}
class AfterSalesProcessing extends React.Component<Props, {}> {
  render() {
    return (
      <Card title={<AfterSaleDetailTitle />}>
        <CustomerProcessInfo data={this.props.data} />
        <LogisticsInformation data={this.props.data} />
        <SupplierProcessInfo data={this.props.data} />
      </Card>
    );
  }
}

export default connect((state: any) => {
  return {
    data: state[namespace].data || {},
  };
})(AfterSalesProcessing);
