import React from 'react'
import { Tabs, Card } from 'antd'
import TabItem from './TabItem'

const { TabPane } = Tabs
class Main extends React.Component {
  public state = {
    activeKey: '1'
  }
  public onChange = (activeKey: string) => {
    console.log('activeKey =>', activeKey)
    this.setState({ activeKey })
  }
  public render () {
    return (
      <Card>
        <Tabs
          activeKey={this.state.activeKey}
          onChange={this.onChange}
        >
          <TabPane tab='喜团优选' key='1'>
            <TabItem />
          </TabPane>
          <TabPane tab='喜团好店' key='2'>
            <TabItem />
          </TabPane>
        </Tabs>
      </Card>
    )
  }
}

export default Main