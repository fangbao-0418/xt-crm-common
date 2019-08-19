import React from 'react';
import { Card, Row, Col } from 'antd';
import { unionAddress } from '../../helper';

const payTypeList = {
  100: '微信APP',
  101: '微信小程序',
  102: '微信公众号',
  200: '支付宝APP',
  201: '支付宝H5',
};

const memberTypes = {
  '0': '非会员',
  '10': '团长',
  '20': '区长',
  '30': '合伙人',
  '40': '管理员',
  '50': '公司',
}

const BuyerInfo = props => {
  const { buyerInfo = {} } = props;
  const { userName, phone, payType, idCard, nickname, contact, memberAddress = {} } = buyerInfo;
  return (
    <Card>
      <Row>买家信息</Row>
      <Row>
      <Col className="gutter-row" span={6}>
          <div className="gutter-box">用户名:{userName}</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">付款方式：{payTypeList[payType]}</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">身份证号:{idCard}</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">手机号：{phone}</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">微信昵称:{nickname}</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">会员等级:{memberTypes[buyerInfo.memberType]}</div>
        </Col>
      </Row>
      <Row>收货信息</Row>
      
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
            <div className="gutter-box">收货人姓名：{contact}</div>
        </Col>
        <Col className="gutter-row" span={12}>
          <div className="gutter-box">
            收货地址:{unionAddress(memberAddress)}，{memberAddress.consignee},{memberAddress.phone}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default BuyerInfo;
