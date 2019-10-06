import React from 'react';
import { Card, Row, Col } from 'antd';

const RefundInformation: React.FC = () => {
  return (
    <>
      <h4>退款信息</h4>
      <Row gutter={24}>
        <Col span={8}>退款方式：自动退款</Col>
        <Col span={8}>退款平台：支付宝</Col>
        <Col span={8}>退款发起时间：2019.10.9 19:00:00</Col>
        <Col span={8}>退款完成时间：2019.10.9 19:10:00</Col>
        <Col span={8}>退款凭证：0CSXKOP1232413</Col>
      </Row>
    </>
  );
};
export default RefundInformation;
