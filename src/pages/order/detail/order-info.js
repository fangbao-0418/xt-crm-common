import React from 'react';
import { Card, Row, Col } from 'antd';
import { OrderStatusTextMap } from '../constant';
import { formatDate, unionAddress } from '../../helper';
import memberType from '@/enum/memberType';
const initOrderInfo = {
  childOrderList: [
    {
      createTime: 0,
      orderCode: 'string',
      paymentNumber: 'string',
      storeName: 'string',
    },
  ],
  createTime: 0,
  orderCode: 'string',
  orderStatus: 0,
  paymentNumber: 'string',
  remark: 'string',
};

const OrderInfo = ({ orderInfo = initOrderInfo, buyerInfo = {} }) => {
  const { orderStatus, orderCode, platform, remark, orderTypeStr, finishTime, createTime, orderMemberType } = orderInfo;
  const { phone, contact, memberAddress = {}, userName, nickname } = buyerInfo;
  return (
    <Card title="订单信息">
      <Row gutter={24}>
        <Col span={8}>订单编号：{orderCode}</Col>
        <Col span={8}>创建时间：{formatDate(createTime)}</Col>
        <Col span={8}>订单状态：{OrderStatusTextMap[orderStatus]}</Col>
        <Col span={8}>买家名称：{userName}</Col>
        <Col span={8}>微信昵称：{nickname}</Col>
        <Col span={8}>联系电话：{phone}</Col>
        <Col span={8}>订单来源：{platform}</Col>
        <Col span={8}>订单类型：{orderTypeStr}</Col>
        <Col span={8}>完成时间：{formatDate(finishTime)}</Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>下单会员类型：{memberType.getValue(orderMemberType)}</Col>
        <Col span={16}>收货信息：{unionAddress(memberAddress)}，{contact}，{memberAddress &&　memberAddress.phone}</Col>
      </Row>
      <Row>
        <Col>买家备注：{remark}</Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>真实姓名：</Col>
        <Col span={8}>身份证号：</Col>
      </Row>
    </Card>
  );
};

export default OrderInfo;
