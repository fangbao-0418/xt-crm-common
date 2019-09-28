import React from 'react';
import { Card, Row, Col } from 'antd';

const LogisticsInformation: React.FC = () => {
  return (
    <Card title="供应商处理信息">
      <Row>
        <Col>供应商名称：喜团义乌自营仓</Col>
        <Col>供应商类型：自营仓/大供应商/小供应商</Col>
        <Col>供应商收货状态：  未收货</Col>
        <Col>收货数目：2</Col>
        <Col>说明：货品已收货，可以进行售后</Col>
      </Row>
    </Card>
  )
}
export default LogisticsInformation;