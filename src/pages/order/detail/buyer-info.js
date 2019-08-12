import React from 'react';
import { Card, Row, Col } from 'antd';
import { formatPrice } from '@/util/format';
const payTypeList = {
  100: '微信APP',
  101: '微信小程序',
  102: '微信公众号',
  200: '支付宝APP',
  201: '支付宝H5',
};

const BuyerInfo = props => {
  const { buyerInfo = {}, orderInfo = {} } = props;
  const { payType} = buyerInfo;
  return (
    <Card title="支付信息">
      <Row>
        <Col className="gutter-row" span={6}>支付方式: {payTypeList[payType] || '未支付'}</Col>
        <Col className="gutter-row" span={6}>支付时间：{orderInfo.payDate || ''}</Col>
        <Col className="gutter-row" span={6}>交易流水号：{orderInfo.paymentNumber}</Col>
        <Col className="gutter-row" span={6}>实付金额：￥{formatPrice(orderInfo.payMoney)}</Col>
      </Row>
    </Card>
  );
};

export default BuyerInfo;
