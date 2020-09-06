import React from 'react'
import { Tabs, Card } from 'antd'
import TabItem from './TabItem'

const { TabPane } = Tabs

const tabConfig = [{
  label: '所有活动',
  value: ''
}, {
  label: '开放报名中',
  value: '1'
}, {
  label: '活动进行中',
  value: '2'
}, {
  label: '已结束',
  value: '3'
}]
interface State {
  activeKey: string
}
class Main extends React.Component<any, State> {
  public state = {
    activeKey: ''
  }
  public render () {
    const { activeKey } = this.state
    return (
      <Card>
        <Tabs
          activeKey={activeKey}
          onChange={(val) => {
            this.setState({ activeKey: val })
          }}
        >
          {tabConfig.map((item) => (
            <TabPane tab={item.label} key={item.value}>
              <TabItem />
            </TabPane>
          ))}
        </Tabs>
      </Card>
    )
  }
}

export default Main