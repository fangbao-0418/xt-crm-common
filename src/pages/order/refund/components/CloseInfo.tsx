import React from 'react';
import { Row } from 'antd';
import moment from 'moment';
/**
 * 关闭信息
 */
interface Props {
  orderServerVO: AfterSalesInfo.OrderServerVO
}
const CloseInfo: React.FC<Props> = ({orderServerVO}: Props) => {
  return (
    <>
      <h4>售后关闭信息</h4>
      <Row>关闭时间: {moment(orderServerVO.finishTime).format('YYYY-MM-DD HH:mm:ss')}</Row>
      <Row>处理人: {orderServerVO.operator}</Row>
      <Row>说明: {orderServerVO.info}</Row>
    </>
  )
}
export default CloseInfo;