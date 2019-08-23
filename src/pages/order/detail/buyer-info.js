import React from 'react';
import { Card, Row, Col } from 'antd';
import { formatPrice } from '@/util/format';
import { formatDate } from '@/pages/helper';
const payTypeList = {
  100: '微信APP',
  101: '微信小程序',
  102: '微信公众号',
  200: '支付宝APP',
  201: '支付宝H5',
};

const BuyerInfo = props => {
  const { buyerInfo = {}, orderInfo = {} } = props;
  const { payType } = buyerInfo;
  return (
    <Card title="支付信息">
      <Row gutter={24}>
        <Col span={8}>支付方式: {payTypeList[payType] || '未支付'}</Col>
        <Col span={8}>支付时间：{formatDate(orderInfo.payDate) || ''}</Col>
        <Col span={8}>交易流水号：{orderInfo.paymentNumber}</Col>
        <Col span={8}>实付金额：￥{formatPrice(orderInfo.payMoney)}</Col>
      </Row>
    </Card>
  );
};

export default BuyerInfo;
