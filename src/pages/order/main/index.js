import React, { Component } from 'react';
import { Tabs, Card } from 'antd';

import List from '../order-table';
import { TabList } from '../constant';
// import UploadView from '../../../components/upload';

const { TabPane } = Tabs;

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleTabClick = key => {
    console.log(key, 'key');
    window.location = '/#' + key;
  };
  render() {
    const {
      location: { pathname },
    } = this.props;
    let orderStatus;
    TabList.some(tab => {
      if (tab.url === pathname) {
        orderStatus = tab.status;
        return true;
      }
      return false;
    });
    return (
      <div>
        <Card key={orderStatus}>
          <Tabs activeKey={pathname} onTabClick={this.handleTabClick}>
            {TabList.map(tab => {
              return <TabPane tab={tab.name} key={tab.url} />;
            })}
          </Tabs>
          {/* <UploadView /> */}
          <List orderStatus={orderStatus} type="order" />
        </Card>
      </div>
    );
  }
}

export default Order;
