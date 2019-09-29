import React from 'react';
import { Card, Row, Col } from 'antd';
import refundType from '@/enum/refundType';
import createType from '@/enum/createType';
import moment from 'moment';
type OrderServerVO = AfterSalesInfo.OrderServerVO;
const WaitPlatformDelivery: React.FC<OrderServerVO> = (orderServerVO: OrderServerVO) => {
  return (
    <>
      <h4>售后申请信息</h4>
      <Row gutter={24}>
        <Col span={8}>售后类型：{refundType.getValue(orderServerVO.refundType)}</Col>
        <Col span={8}>售后原因：{orderServerVO.returnReasonStr}</Col>
        <Col span={8}>申请时间：{moment(orderServerVO.createTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
        <Col span={8}>最后处理时间：{orderServerVO.handleTime ? moment(orderServerVO.handleTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Col>
        <Col span={8}>处理人：{orderServerVO.operator}</Col>
        <Col span={8}>申请人类型：{createType.getValue(orderServerVO.createType)}</Col>
        <Col span={8}>售后说明：{orderServerVO.info || '-'}</Col>
      </Row>
    </>
  )
}
export default WaitPlatformDelivery;