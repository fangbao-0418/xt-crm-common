import React from 'react';
import { Row, Col } from 'antd';
import refundType from '@/enum/refundType';
import { formatMoney } from '@/pages/helper'
function CustomerServiceReview({ checkVO }) {
  return (
    <Row gutter={24}>
      <Col span={8}>审核意见：{checkVO.firstRefundStatusStr + ' ' + checkVO.refundStatusStr}</Col>
      <Col span={8}>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
      <Col span={8}>退款金额：{formatMoney(checkVO.refundAmount)}</Col>
      <Col span={8}>说明：{checkVO.firstServerDescribe}</Col>
      <Col span={8}>退货信息：{checkVO.returnContact + ' ' + checkVO.returnPhone + ' ' + checkVO.returnAddress}</Col>
    </Row>
  )
}
export default CustomerServiceReview;