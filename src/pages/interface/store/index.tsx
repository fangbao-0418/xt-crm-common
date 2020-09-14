import React from 'react'
import { Tabs } from 'antd'
import TabItem from './TabItem'

const { TabPane } = Tabs
class Main extends React.Component {
  public state = {
    bizSource: '0'
  }
  public onChange = (bizSource: string) => {
    this.setState({ bizSource })
  }
  public render () {
    const { bizSource } = this.state
    return (
      <Tabs
        activeKey={this.state.bizSource}
        onChange={this.onChange}
      >
        <TabPane tab='喜团优选' key='0'>
          <TabItem bizSource={bizSource} />
        </TabPane>
        <TabPane tab='喜团好店' key='20'>
          <TabItem bizSource={bizSource} />
        </TabPane>
      </Tabs>
    )
  }
}

export default Main