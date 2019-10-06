import React from 'react';
import { Card, Row, Col } from 'antd';

const RefundInformation: React.FC = () => {
  return (
    <>
      <h4>退款信息</h4>
      <Row gutter={24}>
        <Col span={8}>退款方式：</Col>
        <Col span={8}>退款平台：</Col>
        <Col span={8}>退款发起时间：</Col>
        <Col span={8}>退款完成时间：</Col>
        <Col span={8}>退款凭证：</Col>
      </Row>
    </>
  );
};
export default RefundInformation;
