import React, { Component } from 'react'
import { Tabs, Card } from 'antd'
import List from './list'
import { namespace } from './config'
import { parseQuery } from '@/util/utils'
const { TabPane } = Tabs

class Order extends Component {
  constructor (props) {
    super(props)

    const obj = parseQuery()
    const keys = Object.keys(obj)
    const type = keys.length > 0 ? 'ALL': (APP.fn.getPayload(namespace)?.type || 'ALL')

    this.state = {
      type
    }
  }
  handleTabChange = type => {
    APP.fn.setPayload(namespace, {})
    this.setState({
      type
    })
  };
  render () {
    const { type } = this.state
    return (
      <div>
        <Card>
          <Tabs activeKey={`${type}`} onChange={this.handleTabChange}>
            <TabPane tab='所有售后订单' key='ALL' />
            <TabPane tab='待审核' key='WAITCONFIRM' />
            <TabPane tab='处理中' key='OPERATING' />
            <TabPane tab='已完成' key='COMPLETE' />
            <TabPane tab='已关闭' key='REJECTED' />
          </Tabs>
          <List wrappedComponentRef={ref => (this.list = ref)} key={type} type={type} />
        </Card>
      </div>
    )
  }
}

export default Order
