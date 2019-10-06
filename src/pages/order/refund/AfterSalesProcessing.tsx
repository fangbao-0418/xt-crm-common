import React from 'react';
import { Card } from 'antd';
import AfterSaleDetailTitle from './components/AfterSaleDetailTitle';
import CustomerProcessInfo from './components/CustomerProcessInfo';
import LogisticsInformation from './components/LogisticsInformation';
import SupplierProcessInfo from './components/SupplierProcessInfo';
import RefundInformation from './components/RefundInformation';
import { enumRefundType, enumRefundStatus } from '../constant';
interface Props {
  data: AfterSalesInfo.data;
}
const AfterSalesProcessing: React.FC<Props> = ({ data }: Props) => {
  const isRefundTypeOf = (refundType: enumRefundType): boolean => {
    return data.refundType == refundType;
  };
  const isRefundStatusOf = (refundStatus: number): boolean => {
    return data.refundStatus == refundStatus;
  };
  /**
   * 仅当退货退款或者换货且不是待用户发货状态
   */
  const isShowShippingLogisticsOrSupplierInfo =
    !isRefundTypeOf(enumRefundType.Refund) && !isRefundStatusOf(enumRefundStatus.Operating);
  return (
    <Card title={<AfterSaleDetailTitle />}>
      <CustomerProcessInfo data={data} />
      {isShowShippingLogisticsOrSupplierInfo && (
        <>
          <LogisticsInformation data={data} />
          <SupplierProcessInfo data={data} />
        </>
      )}
      {/* <RefundInformation /> */}
    </Card>
  );
};

export default AfterSalesProcessing;
