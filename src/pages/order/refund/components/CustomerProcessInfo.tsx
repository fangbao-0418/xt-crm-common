import React from 'react';
import { Card, Row } from 'antd';

const WaitPlatformDelivery: React.FC = () => {
  return (
    <Card title="客服处理信息">
      <Row>售后类型：退货退款</Row>
      <Row>售后数目：   2</Row>
      <Row>退款金额：250</Row>
      <Row>退款地址：</Row>
      <Row>八宝  13644445555 杭州市余杭区欧美金融中心美国中心南楼</Row>
      <Row>说    明： 安排售后退货退款1个，退款2450元</Row>
    </Card>
  )
}
export default WaitPlatformDelivery;