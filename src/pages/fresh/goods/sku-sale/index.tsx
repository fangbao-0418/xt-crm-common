import React from 'react'
import { Card, Tabs } from 'antd'
import TabItem, { StatusType } from './TabItem'
import { getPayload, setPayload } from '@/packages/common/utils'
const { TabPane } = Tabs

interface State {
  status: StatusType
}

const tabConfigs: { key: StatusType, title: string }[] = [
  { key: '0', title: '出售中' },
  { key: '1', title: '仓库中' }
]

const namespace = 'fresh/goods/list-status'

class SkuSaleList extends React.Component<any, State> {
  state: State = {
    status: String(getPayload(namespace) || '0') as StatusType
  }
  // 切换tabPane
  handleChange = (key: string) => {
    setPayload(namespace, key)
    this.setState({
      status: key as StatusType
    })
  };
  render () {
    const { status } = this.state
    return (
      <Card>
        <Tabs
          activeKey={status}
          animated={false}
          onChange={this.handleChange}
        >
          {
            tabConfigs.map((item) => {
              return (
                <TabPane tab={item.title} key={item.key}>
                  <TabItem status={item.key} />
                </TabPane>
              )
            })
          }
        </Tabs>
      </Card>
    )
  }
}

export default SkuSaleList
