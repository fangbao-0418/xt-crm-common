import React from 'react';
import { Card, Row, Col } from 'antd';
import refundType from '@/enum/refundType';
import { formatMoney, joinFilterEmpty } from '@/pages/helper'
function CustomerServiceReview({ checkVO = {}, orderServerVO = {} }) {
  return (
    <Card title="审核信息">
      <Row>
        <Col>审核意见：{ checkVO.firstRefundStatusStr || checkVO.refundStatusStr}</Col>
        <Col>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
        {checkVO.refundType == '20' && <Col>退款金额：￥{formatMoney(checkVO.refundAmount)}</Col>}
        {/* 仅退款、退货退款 */ checkVO.refundType == '20' && orderServerVO.refundType !== '30' && <Col>退运费：￥{formatMoney(checkVO.freight)}</Col>}
        <Col>说明：{checkVO.firstServerDescribe || checkVO.serverDescribe}</Col>
        {/* 退货退款、仅换货 */ orderServerVO.refundType !== '20' && <Col>退货信息：{joinFilterEmpty([checkVO.returnContact, checkVO.returnPhone, checkVO.returnAddress])}</Col>}
      </Row>
    </Card>
  )
}
export default CustomerServiceReview;