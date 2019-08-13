import React from 'react';
import { Card, Row, Col } from 'antd';
import refundType from '@/enum/refundType';
import { formatMoney, calcCurrent, joinFilterEmpty } from '@/pages/helper'
function CustomerServiceReview({ checkVO = {}, orderServerVO = {}, refundStatus }) {
  let current = calcCurrent(refundStatus);
  return (
    <Card title="审核信息">
      <Row>
        <Col>审核意见：{current === 1 ? checkVO.firstRefundStatusStr : checkVO.refundStatusStr}</Col>
        <Col>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
        <Col>退款金额：￥{formatMoney(checkVO.refundAmount)}</Col>
        <Col>说明：{current === 1 ? checkVO.firstServerDescribe: checkVO.serverDescribe}</Col>
        {orderServerVO.refundType !== '20' && <Col>退货信息：{joinFilterEmpty([checkVO.returnContact, checkVO.returnPhone, checkVO.returnAddress])}</Col>}
      </Row>
    </Card>
  )
}
export default CustomerServiceReview;