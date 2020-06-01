/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-28 14:28:45
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/order/main/index.js
 */
import React, { Component } from 'react'
import { Tabs, Card } from 'antd'

import List from '../order-table'
import { TabList } from '../constant'
const { TabPane } = Tabs

class Order extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  handleTabClick = key => {
    window.location.href = window.location.pathname + '#' + key
  };
  render () {
    const {
      location: { pathname }
    } = this.props
    let orderStatus
    TabList.some(tab => {
      if (tab.url === pathname) {
        orderStatus = tab.status
        return true
      }
      return false
    })
    return (
      <div>
        <Card key={orderStatus}>
          <Tabs activeKey={pathname} onTabClick={this.handleTabClick}>
            {TabList.map(tab => {
              return <TabPane tab={tab.name} key={tab.url} />
            })}
          </Tabs>
          <List orderStatus={orderStatus} pathname={pathname} type='order' />
        </Card>
      </div>
    )
  }
}

export default Order
