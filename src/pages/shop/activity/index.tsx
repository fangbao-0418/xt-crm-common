import React from 'react'
import { Tabs } from 'antd'

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

class Main extends React.Component {
  public render () {
    return (
      <Tabs>
        {tabConfig.map((item) => (
          <TabPane tab={item.label} key={item.value}></TabPane>
        ))}
      </Tabs>
    )
  }
}

export default Main