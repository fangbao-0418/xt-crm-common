import React from 'react';
import { Card, Row, Col } from 'antd';

const BuyerInfo = ({ orderList = [] }) => {
  return (
    <Card>
      <Row>子订单</Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">姓名：姓名</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">付款方式：微信支付</div>
        </Col>

        <Col className="gutter-row" span={6}>
          <div className="gutter-box">身份证号</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">手机号</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">用户名</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">收货地址</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">微信昵称</div>
        </Col>
      </Row>
      <Row>收货地址</Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <div className="gutter-box">
            收货地址: 上海，上海市，浦东新区，具体地址，姓名，18888888888
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default BuyerInfo;
