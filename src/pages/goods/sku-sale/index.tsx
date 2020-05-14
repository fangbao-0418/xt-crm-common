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
  { key: '1', title: '仓库中' },
  { key: '3', title: '待上架' },
  { key: '2', title: '商品池' }
]

const namespace = 'goods/list-status'

class SkuSaleList extends React.Component<any, State> {
  public state: State = {
    status: String(getPayload(namespace) || '0') as StatusType
  }
  // 切换tabPane
  public handleChange = (key: string) => {
    setPayload(namespace, key)
    this.setState({
      status: key as StatusType
    })
  }
  public render () {
    const { status } = this.state
    return (
      <Card>
        <Tabs
          activeKey={status}
          onChange={this.handleChange}
          animated={false}
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
