import React from 'react';
import { Card, Row, Col } from 'antd';
import { OrderStatusTextMap } from '../constant';
// import RemarkDialog from '../components/remark-modal';
import { formatDate, unionAddress } from '../../helper';
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

const payTypeList = {
  100: '微信APP',
  101: '微信小程序',
  102: '微信公众号',
  200: '支付宝APP',
  201: '支付宝H5',
};
const OrderInfo = ({ orderInfo = initOrderInfo, buyerInfo = {}, refresh }) => {
  const { orderStatus, orderCode, platform, paymentNumber, remark, orderTypeStr } = orderInfo;
  const { userName, phone, payType, idCard, nickname, contact, memberAddress = {} } = buyerInfo;
  return (
    <Card title="订单信息">
      <Row gutter={24}>
        <Col span={6}>订单编号：{orderCode}</Col>
        <Col span={6}>创建时间：{formatDate(orderInfo.createTime)}</Col>
        <Col span={6}>订单状态：{OrderStatusTextMap[orderStatus]}</Col>
        <Col span={6}>买家名称：{contact}</Col>
        {/* <Col span={6}>订单类型：{orderTypeStr}</Col> */}
      </Row>
      <Row gutter={24}>
        <Col span={6}>联系电话：{phone}</Col>
        <Col span={6}>订单来源：{platform}</Col>
        <Col span={6}>收货信息：{unionAddress(memberAddress)}，{memberAddress.consignee}，{memberAddress.phone}</Col>
        <Col span={6}>买家备注：{remark}</Col>
          {/* <div className="gutter-box">
            {payTypeList[payType]}支付流水号：{paymentNumber}
          </div>
        </Col> */}
        {/* <Col span={6}>
          <div className="gutter-box">
            支付金额：￥{orderInfo.payMoney/100}
          </div>
        </Col> */}
      </Row>
      {/* <Row gutter={24}>
        <Col span={6}>
          <div className="gutter-box">创建时间: {formatDate(orderInfo.createTime)}</div>
        </Col>
        {orderStatus > 10 ? <Col span={6}>
          <div className="gutter-box">支付时间：{formatDate(orderInfo.payDate)}</div>
        </Col> : ''}
        {orderStatus == 50 ? <Col span={6}>
          <div className="gutter-box">结束时间：{formatDate(orderInfo.finishTime)}</div>
        </Col> : ''}
        {orderStatus == 60 ? <Col span={6}>
          <div className="gutter-box">关闭时间：{formatDate(orderInfo.closeTime)}</div>
        </Col>: ''}
      </Row> */}
      {/* {remark && <Row>{remark}</Row>} */}
      {/* <RemarkDialog orderCode={orderCode} onSuccess={refresh} /> */}
    </Card>
  );
};

export default OrderInfo;
