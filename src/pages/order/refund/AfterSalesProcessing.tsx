import React from 'react';
import { Card } from 'antd';
import {
  AfterSaleDetailTitle,
  CustomerProcessInfo,
  LogisticsInformation,
  SupplierProcessInfo,
  RefundInformation,
  AfterSaleApplyInfo,
} from './components';
import { enumRefundType, enumRefundStatus } from '../constant';
interface Props {
  data: AfterSalesInfo.data;
}
const AfterSalesProcessing: React.FC<Props> = ({ data }: Props) => {
  const isRefundTypeOf = (refundType: enumRefundType): boolean => {
    return data.refundType == refundType;
  };
  const isRefundStatusOf = (refundStatus: enumRefundStatus | enumRefundStatus[]): boolean => {
    const equalAs = (refundStatus: enumRefundStatus) => data.refundStatus === refundStatus;
    return Array.isArray(refundStatus) ? refundStatus.some(equalAs) : equalAs(refundStatus);
  };
  /**
   * 仅当退货退款或者换货且不是待用户发货状态
   */
  const isShowShippingLogisticsOrSupplierInfo =
    !isRefundTypeOf(enumRefundType.Refund) && !isRefundStatusOf(enumRefundStatus.Operating);
  return (
    <>
      <Card title={<AfterSaleDetailTitle />}>
        <CustomerProcessInfo data={data} />
        {isShowShippingLogisticsOrSupplierInfo && (
          <>
            <LogisticsInformation data={data} />
            <SupplierProcessInfo data={data} />
          </>
        )}
        {!isRefundTypeOf(enumRefundType.Exchange) &&
          !isRefundStatusOf([
            enumRefundStatus.OperatingOfMoney,
            enumRefundStatus.OperatingOfGoods,
            enumRefundStatus.WaitCustomerServiceOperating,
          ]) && <RefundInformation />}
      </Card>
      <AfterSaleApplyInfo orderServerVO={data.orderServerVO} />
    </>
  );
};

export default AfterSalesProcessing;
