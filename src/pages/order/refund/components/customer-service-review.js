import React from 'react';
import { Row, Col } from 'antd';
import refundType from '@/enum/refundType';
import { formatMoney, calcCurrent, joinFilterEmpty } from '@/pages/helper'
function CustomerServiceReview({ checkVO = {}, orderServerVO={}, refundStatus}) {
  let current = calcCurrent(refundStatus);
  return (
    <Row gutter={24}>
      <Col span={8}>审核意见：{current === 1 ? checkVO.firstRefundStatusStr: checkVO.refundStatusStr}</Col>
      <Col span={8}>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
      <Col span={8}>退款金额：￥{formatMoney(checkVO.refundAmount)}</Col>
      <Col span={8}>说明：{checkVO.firstServerDescribe}</Col>
      {orderServerVO.refundType !== '20' && <Col span={8}>退货信息：{joinFilterEmpty([checkVO.returnContact, checkVO.returnPhone, checkVO.returnAddress])}</Col>}
    </Row>
  )
}
export default CustomerServiceReview;