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
  202: '花呗'
};
/** 获取花呗分期文案 */
const getCreditPayText = (memberPayHuabeiLogDO) => {
  const hbFqNum = String(memberPayHuabeiLogDO.memberPayHuabeiLogDO || -1)
  const { sellerPercent } = memberPayHuabeiLogDO
  if (hbFqNum === '-1') {
    return `花呗`
  }
  return `花呗分期-${memberPayHuabeiLogDO.hbFqNum}期` + (sellerPercent === 100 ? '免息' : '')
}
const BuyerInfo = props => {
  const { buyerInfo = {}, orderInfo = {} } = props;
  const { payType, memberPayHuabeiLogDO = {} } = buyerInfo;
  return (
    <Card title="支付信息">
      <Row gutter={24}>
        <Col span={8}>支付方式: {(String(payType) === '202' ? getCreditPayText(memberPayHuabeiLogDO) : payTypeList[payType]) || '未支付'}</Col>
        <Col span={8}>支付时间：{formatDate(orderInfo.payDate) || ''}</Col>
        <Col span={8}>交易流水号：{orderInfo.paymentNumber}</Col>
        <Col span={8}>实付金额：￥{formatPrice(orderInfo.payMoney)}</Col>
      </Row>
    </Card>
  );
};

export default BuyerInfo;
