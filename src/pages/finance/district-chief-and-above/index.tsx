import React from 'react'
import { Tabs, Card } from 'antd'
import TabItem from './TabItem'

const { TabPane } = Tabs
type StatusType = '0' | '1' | '2' | '3' | '4'

const tabConfigs: { key: StatusType, title: string }[] = [
  { key: '0', title: '全部' },
  { key: '1', title: '待提现' },
  { key: '2', title: '提现中' },
  { key: '3', title: '提现成功' },
  { key: '4', title: '提现失败' }
]

class Main extends React.Component {
  public render () {
    return (
      <Card>
        <Tabs>
          {tabConfigs.map((item) => {
            return (
              <TabPane tab={item.title} key={item.key}>
                <TabItem />
              </TabPane>
            )
          })}
        </Tabs>
      </Card>
    )
  }
}

export default Main