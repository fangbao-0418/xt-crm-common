import React from 'react';
import { connect } from 'react-redux';
import { Row } from 'antd';
import { enumRefundType } from '../../constant';
import { refundType } from '@/enum';
interface Props {
  data: AfterSalesInfo.data;
}

type CheckVO = AfterSalesInfo.CheckVO;

// 退货地址
// const returnAddress = (checkVO: CheckVO) => {
//   return checkVO.returnContact + ' ' + checkVO.returnPhone + ' ' + checkVO.returnAddress;
// }

const CustomerProcessInfo: React.FC<Props> = ({ data }: Props) => {  
  let checkVO: CheckVO = data.checkVO || {};
  let orderInfoVO = data.orderInfoVO || {};
  const isRefundTypeOf = (refundType: number | string) => {
    return checkVO.refundType == refundType;
  }
  return (
    <div>
      <h4>客服处理信息</h4>
      <Row>售后类型：{refundType.getValue(checkVO.refundType)}</Row>
      <Row>售后数目：{checkVO.refundAmount}</Row>
      {/* 退货退款/仅退款 */}
      {!isRefundTypeOf(enumRefundType.Exchange) && <Row>退款金额：</Row>}
      <Row>退货地址：{orderInfoVO.address}</Row>
      {/* 换货 */}
      {isRefundTypeOf(enumRefundType.Exchange) && <Row>收货地址：{orderInfoVO.address}</Row>}
      <Row>说 明：{checkVO.firstServerDescribe}</Row>
    </div>
  );
};
export default CustomerProcessInfo;
