import React, { useState } from 'react';
import { Card, Row, Col, Modal, Table } from 'antd';
import { OrderStatusTextMap } from '../constant';
import { formatDate, unionAddress } from '../../helper';
import { levelName } from '../../user/utils';
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

const OrderInfo = ({ orderInfo = initOrderInfo, buyerInfo = {}, refresh }) => {
  const [visible, setVisible] = useState(false);
  const { orderStatus, orderCode, platform, remark, orderTypeStr, finishTime, createTime, orderMemberType, orderMemberTypeLevel, closeReason } = orderInfo;
  const { phone, contact, memberAddress = {}, userName, nickname } = buyerInfo;
  return (
    <>
      <Modal
        title='关联订单'
        onCancel={() => setVisible(false)}
        visible={visible}
        footer={null}
      >
        <Table columns={[{
          title: '拼团编号',
          dataIndex: 'ID'
        }, {
          title: '订单编号',
          dataIndex: 'orderNum'
        }, {
          title: '状态',
          dataIndex: 'status'
        }]}/>
      </Modal>
      <Card title="订单信息">
        <Row gutter={24}>
          <Col span={8}>订单编号：{orderCode}</Col>
          <Col span={8}>创建时间：{formatDate(createTime)}</Col>
          <Col span={8}>订单状态：{OrderStatusTextMap[orderStatus]}</Col>
          {orderStatus === 60 && <Col span={8}>关闭原因：{closeReason}</Col>}
          <Col span={8}>买家名称：{userName}</Col>
          <Col span={8}>微信昵称：{nickname}</Col>
          <Col span={8}>联系电话：{phone}</Col>
          <Col span={8}>订单来源：{platform}</Col>
          <Col span={8}>订单类型：{orderTypeStr}</Col>
          <Col span={8}>完成时间：{formatDate(finishTime)}</Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>下单会员类型：{levelName({memberType: orderMemberType, memberTypeLevel: orderMemberTypeLevel})}</Col>
          <Col span={16}>收货信息：{unionAddress(memberAddress)}，{contact}，{memberAddress &&　memberAddress.phone}</Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>买家备注：{remark}</Col>
          <Col span={16}>拼团编号：<span className='href' onClick={() => setVisible(true)}>424214124781278</span></Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>真实姓名：{buyerInfo.realName}</Col>
          <Col span={8}>身份证号：{buyerInfo.idNo}</Col>
        </Row>
      </Card>
    </>
  );
};

export default OrderInfo;
