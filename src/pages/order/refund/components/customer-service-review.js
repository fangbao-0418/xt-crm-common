import React from 'react';
import { Card, Row, Col } from 'antd';
import refundType from '@/enum/refundType';
import { formatMoney, calcCurrent, joinFilterEmpty } from '@/pages/helper'
function CustomerServiceReview({ checkVO = {}, orderServerVO = {}, refundStatus }) {
  console.log('checkVO=>', checkVO)
  let current = calcCurrent(refundStatus);
  return (
    <Card title="审核信息">
      <Row>
        <Col>审核意见：{current === 1 ? checkVO.firstRefundStatusStr : checkVO.refundStatusStr}</Col>
        <Col>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
        <Col>退款金额：￥{formatMoney(checkVO.refundAmount)}</Col>
        {/* 仅退款、退货退款 */}
        {orderServerVO.refundType !== '30' && <Col>退运费：￥{formatMoney(checkVO.freight)}</Col>}
        <Col>说明：{current === 1 ? checkVO.firstServerDescribe: checkVO.serverDescribe}</Col>
        {/* 退货退款、仅换货 */}
        {orderServerVO.refundType !== '20' && <Col>退货信息：{joinFilterEmpty([checkVO.returnContact, checkVO.returnPhone, checkVO.returnAddress])}</Col>}
      </Row>
    </Card>
  )
}
export default CustomerServiceReview;