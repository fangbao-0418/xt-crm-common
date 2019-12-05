import React from 'react';
import { connect } from 'react-redux';
import { Row } from 'antd';
import { enumRefundType } from '../../constant';
import { refundType } from '@/enum';
import { formatMoneyWithSign } from '@/pages/helper';
interface Props {
  data: AfterSalesInfo.data;
}

const CustomerProcessInfo: React.FC<Props> = ({ data }: Props) => {
  let checkVO = Object.assign({}, data.checkVO);
  let orderServerVO = Object.assign({}, data.orderServerVO);
  let contactVO = Object.assign({}, orderServerVO.contactVO);
  const isRefundTypeOf = (refundType: number | string) => {
    return checkVO.refundType == refundType;
  };
  return (
    <div>
      <h4 style={{marginTop: 0}}>客服处理信息</h4>
      <Row>售后类型：{refundType.getValue(checkVO.refundType)}</Row>
      <Row>售后数目：{checkVO.serverNum}</Row>
      {/* 退货退款/仅退款 */}
      {!isRefundTypeOf(enumRefundType.Exchange) && (
        <Row>退款金额：{formatMoneyWithSign(checkVO.refundAmount)}</Row>
      )}
      {!isRefundTypeOf(enumRefundType.Refund) && <Row>退货地址：{`${checkVO.returnContact} ${checkVO.returnPhone} ${checkVO.returnAddress}`}</Row>}
      {(checkVO.isRefundFreight === 1 && checkVO.freight > 0) && <Row>退运费：{formatMoneyWithSign(checkVO.freight)}</Row>}
      {/* 换货 */}
      {isRefundTypeOf(enumRefundType.Exchange) && <Row>收货地址：{`${contactVO.contact} ${contactVO.phone} ${contactVO.province}${contactVO.city}${contactVO.district}${contactVO.street}`}</Row>}
      <Row>说 明：{checkVO.reply}</Row>
    </div>
  );
};
export default CustomerProcessInfo;
