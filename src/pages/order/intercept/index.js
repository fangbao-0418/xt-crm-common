import React, { Component } from 'react';
import { Card, Tabs, Form } from 'antd';
import { parseQuery, setQuery } from '@/util/utils'
import Config from './config';
import User from './user';

const { TabPane } = Tabs;

export default class extends Component {
  constructor(props) {
    super(props);
    const queryObj = parseQuery();
    this.state = {
      activeKey: queryObj.key || 'rule'
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const queryObj = parseQuery();
    return {
      activeKey: queryObj.key || 'rule'
    };
  }

  render() {
    const { activeKey } = this.state;
    return (
      <Card>
        <Tabs activeKey={activeKey} onChange={this.onTabChange}>
          <TabPane tab="规则设置" key='rule'>
            <Config />
          </TabPane>
          <TabPane tab="拦截用户列表" key='user'>
            <User />
          </TabPane>
        </Tabs>
      </Card>
    );
  }

  onTabChange = (activeKey) => {
    setQuery({
      key: activeKey
    })
  }
}
