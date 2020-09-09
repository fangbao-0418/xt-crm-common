import React from 'react'
import { Tabs, Card } from 'antd'
import TabItem from './TabItem'

const { TabPane } = Tabs

const tabConfig = [{
  label: '所有活动',
  value: '0'
}, {
  label: '开放报名中',
  value: '2,3,4'
}, {
  label: '活动进行中',
  value: '5'
}, {
  label: '已结束',
  value: '6,7'
}]
interface State {
  activeKey: string
}
class Main extends React.Component<any, State> {
  public state = {
    activeKey: '0'
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
              <TabItem type={item.value} />
            </TabPane>
          ))}
        </Tabs>
      </Card>
    )
  }
}

export default Main