import React, { useState } from 'react';
import { Card, Row, Col, Modal, Table, Button } from 'antd';
import { OrderStatusTextMap } from '../constant';
import { formatDate, unionAddress } from '../../helper';
import { levelName } from '../../user/utils';
import { If } from '@/packages/common/components'
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
  const { orderStatus, orderCode, platform, remark, orderTypeStr, finishTime, createTime, orderMemberType, orderMemberTypeLevel, closeReason, groupBuyCode, groupBuyOrderCodes } = orderInfo;
  const { phone, contact, memberAddress = {}, userName, nickname } = buyerInfo;
  return (
    <>
      <Modal
        title='关联订单'
        onCancel={() => setVisible(false)}
        visible={visible}
        footer={null}
      >
        <Table
          columns={[{
            title: '拼团编号',
            dataIndex: 'groupBuyCode'
          }, {
            title: '订单编号',
            dataIndex: 'orderCode',
            render: (code) => {
              return <Button type='link' href={window.location.pathname + `#/order/detail/${code}`} target="_blank">{code}</Button>
            }
          }, {
            title: '状态',
            dataIndex: 'groupOrderStatus'
          }]}
          dataSource={groupBuyOrderCodes}
        />
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
          <If condition={!!groupBuyCode}>
            <Col span={16}>
              拼团编号：{
                groupBuyCode === orderCode ? groupBuyCode : (
                  <span
                    className='href'
                    onClick={() => setVisible(true)}
                  >
                    {groupBuyCode}
                  </span>
                )
              }
            </Col>
          </If>
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
