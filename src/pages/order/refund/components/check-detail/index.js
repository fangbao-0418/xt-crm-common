import React, { Component } from 'react';
import { Card, Row, Col, Tabs } from 'antd';
import refundType from '@/enum/refundType';
import moment from 'moment';
const { TabPane } = Tabs;
const formatTime = v => moment(v).format('YYYY-MM-DD HH:mm:ss');
class CheckDetail extends Component {
  render() {
    const { checkVO = {}, orderServerVO = {} } = this.props;
    const callback = () => { }
    if (orderServerVO.refundType === '10') {
      return (
        <Card>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="客服审核" key="1">
              <Row gutter={24}>
                <Col span={8}>审核意见：{checkVO.firstRefundStatusStr + ' ' + checkVO.refundStatusStr}</Col>
                <Col span={8}>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
                <Col span={8}>退款金额：{checkVO.refundAmount}</Col>
                <Col span={8}>说明：{checkVO.firstServerDescribe}</Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      );
    } else {
      return (
        <Card>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="客服审核" key="1">
              <Row gutter={24}>
                <Col span={8}>审核意见：{checkVO.firstRefundStatusStr + ' ' + checkVO.refundStatusStr}</Col>
                <Col span={8}>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
                <Col span={8}>说明：{checkVO.firstServerDescribe}</Col>
                <Col span={8}>退货信息：{checkVO.returnContact + ' ' + checkVO.returnPhone + ' ' + checkVO.returnAddress}</Col>
              </Row>
            </TabPane>
            <TabPane tab="退货信息" key="2">
              <Row gutter={24}>
                <Col span={8}>物流公司：{checkVO.returnExpressName}</Col>
                <Col span={8}>物流单号：{checkVO.returnExpressCode}</Col>
                <Col span={8}>提交时间：{formatTime(checkVO.returnExpressTime)}</Col>
              </Row>
            </TabPane>
            {orderServerVO.refundType === '20' && <TabPane tab="发货信息" key="3">
              <Row gutter={24}>
                <Col span={8}>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
                <Col span={8}>退款金额：{checkVO.refundAmount}</Col>
                <Col span={8}>说明：{checkVO.serverDescribe}</Col>
              </Row>
            </TabPane>}
            {orderServerVO.refundType === '30' && <TabPane tab="退款信息" key="4">
              <Row gutter={24}>
                <Col span={8}>物流公司：{checkVO.sendExpressName}</Col>
                <Col span={8}>物流单号：{checkVO.sendExpressCode}</Col>
                <Col span={8}>说明：{checkVO.serverDescribe}</Col>
                <Col span={8}>提交时间：{ formatTime(checkVO.sendExpressTime)}</Col>
              </Row>
            </TabPane>}
          </Tabs>
        </Card >
      );
    }
  }
}
export default CheckDetail;