import React, { Component } from 'react';
import { Tabs, Card } from 'antd';

import List from './list';
import { enumRefundStatus } from '../constant';
const { TabPane } = Tabs;

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refundStatus: enumRefundStatus.All,
    };
  }
  handleTabChange = refundStatus => {
    this.setState({
      refundStatus,
    });
  };
  render() {
    const { refundStatus } = this.state;
    return (
      <div>
        <Card>
          <Tabs activeKey={`${refundStatus}`} onChange={this.handleTabChange}>
            <TabPane tab="所有售后订单" key={enumRefundStatus.All} />
            <TabPane tab="待审核" key={enumRefundStatus.WaitConfirm} />
            <TabPane tab="处理中" key={enumRefundStatus.Operating} />
            <TabPane tab="已完成" key={enumRefundStatus.Complete} />
            <TabPane tab="已关闭" key={enumRefundStatus.Rejected} />
          </Tabs>
          <List
            type="refund"
            key={refundStatus}
            refundStatus={refundStatus}
          />
        </Card>
      </div>
    );
  }
}

export default Order;
