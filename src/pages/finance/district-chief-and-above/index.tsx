import React from 'react'
import { Tabs, Card } from 'antd'
import TabItem from './TabItem'

const { TabPane } = Tabs
export type StatusType = '' | '-31' | '-1' | '0' | '1'

const tabConfigs: { key: StatusType, title: string }[] = [
  { key: '', title: '全部' },
  { key: '-31', title: '待提现' },
  { key: '-1', title: '提现失败' },
  { key: '0', title: '处理中' },
  { key: '1', title: '提现成功' }
]

class Main extends React.Component {
  public state = {
    activeKey: ''
  }
  public onChange = (activeKey: string) => {
    this.setState({ activeKey })
  }
  public render () {
    const { activeKey } = this.state
    return (
      <Card>
        <Tabs
          activeKey={activeKey}
          onChange={this.onChange}
        >
          {tabConfigs.map((item) => {
            return (
              <TabPane tab={item.title} key={item.key}>
                <TabItem transferStatus={item.key} />
              </TabPane>
            )
          })}
        </Tabs>
      </Card>
    )
  }
}

export default Main