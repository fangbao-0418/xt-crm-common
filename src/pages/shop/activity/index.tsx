import React from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const tabConfig = [{
  label: '所有活动',
  value: ''
}, {
  label: '所有活动',
  value: ''
}, {
  label: '所有活动',
  value: ''
}, {
  label: '所有活动',
  value: ''
}, ]

class Main extends React.Component {
  public render () {
    return (
      <Tabs>
        <TabPane></TabPane>
      </Tabs>
    )
  }
}

export default Main