import React from 'react';
import { Card } from 'antd';
import {
  AfterSaleDetailTitle,
  CustomerProcessInfo,
  LogisticsInformation,
  SupplierProcessInfo,
  AfterSaleApplyInfo,
  CloseInfo
} from './components';
import { enumRefundType, enumRefundStatus } from '../constant';
interface Props {
  data: AfterSalesInfo.data;
}
const AfterSalesProcessing: React.FC<Props> = ({ data }: Props) => {
  const orderServerVO = Object.assign({}, data.orderServerVO);
  const isRefundTypeOf = (refundType: enumRefundType): boolean => {
    return data.refundType == refundType;
  };
  const isRefundStatusOf = (refundStatus: enumRefundStatus | enumRefundStatus[]): boolean => {
    const equalAs = (refundStatus: enumRefundStatus) => data.refundStatus === refundStatus;
    return Array.isArray(refundStatus) ? refundStatus.some(equalAs) : equalAs(refundStatus);
  };
  const isBeforeStatusOf = (refundStatus: enumRefundStatus): boolean => {
    return refundStatus === orderServerVO.beforeStatus;
  }
  /**
   * 仅当退货退款或者换货且不是待用户发货状态
   */
  const isShowShippingLogisticsOrSupplierInfo =
    !isRefundTypeOf(enumRefundType.Refund) && !isRefundStatusOf(enumRefundStatus.Operating);
  /**
   * 客户处理显示条件
   * 之前状态是待审核且是已关闭状态
   */
  const falg = !(isBeforeStatusOf(enumRefundStatus.WaitConfirm) && isRefundStatusOf(enumRefundStatus.Rejected));
  return (
    <>
      <Card title={<AfterSaleDetailTitle />}>
        {falg && (
          <>
            <CustomerProcessInfo data={data} />
            {isShowShippingLogisticsOrSupplierInfo && (
              <>
                <LogisticsInformation data={data} />
                <SupplierProcessInfo data={data} />
              </>
            )}
          </>
        )}
        {isRefundStatusOf(enumRefundStatus.Rejected) && <CloseInfo orderServerVO={orderServerVO} />}
        {/* {!isRefundTypeOf(enumRefundType.Exchange) &&
          !isRefundStatusOf([
            enumRefundStatus.OperatingOfMoney,
            enumRefundStatus.OperatingOfGoods,
            enumRefundStatus.WaitCustomerServiceOperating,
          ]) && <RefundInformation />} */}
      </Card>
      <Card bodyStyle={{ paddingTop: 0 }}>
        <AfterSaleApplyInfo orderServerVO={orderServerVO} />
      </Card>
    </>
  );
};

export default AfterSalesProcessing;
