import React, { Component } from 'react';
import { Card, Row, Col, Tabs } from 'antd';
import refundType from '@/enum/refundType';
import CustomerServiceReview from '../customer-service-review';
import ReturnInformation from '../return-information';
import DeliveryInformation from '../delivery-information';
import moment from 'moment';
const { TabPane } = Tabs;
const formatTime = v => moment(v).format('YYYY-MM-DD HH:mm:ss');
class CheckDetail extends Component {
  render() {
    const { checkVO = {}, orderServerVO = {} } = this.props;
    const callback = () => { }
    if (orderServerVO.refundType === '20') {
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
              {/* <Row gutter={24}>
                <Col span={8}>审核意见：{checkVO.firstRefundStatusStr + ' ' + checkVO.refundStatusStr}</Col>
                <Col span={8}>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
                <Col span={8}>说明：{checkVO.firstServerDescribe}</Col>
                <Col span={8}>退货信息：{checkVO.returnContact + ' ' + checkVO.returnPhone + ' ' + checkVO.returnAddress}</Col>
              </Row> */}
              <CustomerServiceReview checkVO={checkVO}/>
            </TabPane>
            <TabPane tab="退货信息" key="2">
              <ReturnInformation checkVO={checkVO}/>
            </TabPane>
            {/* 退货退款 */}
            {orderServerVO.refundType === '10' && <TabPane tab="退款信息" key="4">
              <Row gutter={24}>
                <Col span={8}>物流公司：{checkVO.sendExpressName}</Col>
                <Col span={8}>物流单号：{checkVO.sendExpressCode}</Col>
                <Col span={8}>说明：{checkVO.serverDescribe}</Col>
                <Col span={8}>提交时间：{ formatTime(checkVO.sendExpressTime)}</Col>
              </Row>
            </TabPane>}
            {/* 仅换货 */}
            {orderServerVO.refundType === '30' && <TabPane tab="发货信息" key="3">
              <DeliveryInformation checkVO={checkVO}/>
            </TabPane>}
          </Tabs>
        </Card >
      );
    }
  }
}
export default CheckDetail;