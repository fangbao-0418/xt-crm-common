import React from 'react';
import { Card, Row, Col } from 'antd';

const RefundInformation: React.FC = () => {
  return (
    <Card title="退款信息">
      <Row>
        <Col>退款方式：自动退款</Col>
        <Col>退款平台：支付宝</Col>
        <Col>退款发起时间：2019.10.9  19:00:00</Col>
        <Col>退款完成时间：2019.10.9  19:10:00</Col>
        <Col>退款凭证：0CSXKOP1232413</Col>
      </Row>
    </Card>
  )
}
export default RefundInformation;