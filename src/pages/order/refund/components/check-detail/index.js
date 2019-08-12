import React, { Component } from 'react';
import { Card, Row, Col, Tabs } from 'antd';
import refundType from '@/enum/refundType';
import CustomerServiceReview from '../customer-service-review';
import ReturnInformation from '../return-information';
import DeliveryInformation from '../delivery-information';
import RefundInformation from '../refund-information';
const { TabPane } = Tabs;

class CheckDetail extends Component {
  state = {
    key: 'customer-service-review'
  }
  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };
  render() {
    const { checkVO = {}, orderServerVO = {}, checkType } = this.props;
    if (orderServerVO.refundType === '20') {
      return (
        <Card>
          <Tabs defaultActiveKey="1">
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
      const tabList = [{
        key: 'customer-service-review',
        tab: '客服审核'
      }, {
        key: 'return-information',
        tab: '退货信息'
      }]
      const contentList = {
        'customer-service-review': <CustomerServiceReview checkVO={checkVO} />,
        'return-information': <ReturnInformation checkVO={checkVO} />
      }
      /* 退货退款 */
      if (orderServerVO.refundType === '10') {
        tabList.push({
          key: 'refund-information',
          tab: '退款信息'
        })
        contentList['refund-information'] = <RefundInformation checkVO={checkVO} orderServerVO={orderServerVO} checkType={checkType} />;
      }
      /* 仅换货 */
      else if (orderServerVO.refundType === '30') {
        tabList.push({
          key: 'delivery-information',
          tab: '发货信息'
        })
        contentList['delivery-information'] = <DeliveryInformation checkVO= {checkVO} checkType={checkType} refundType={orderServerVO.refundType} />;
      }
      return (
        <Card
          style={{ width: '100%', minHeight: '352px' }}
          tabList={tabList}
          activeTabKey={this.state.key}
          onTabChange={key => {
            this.onTabChange(key, 'key');
          }}
        >
          {contentList[this.state.key]}
        </Card>
      );
    }
  }
}
export default CheckDetail;