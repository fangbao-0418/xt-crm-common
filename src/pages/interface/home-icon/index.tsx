import React from 'react'
import { Tabs } from 'antd'
import TabItem from './TabItem'

const { TabPane } = Tabs
interface State {
  activeKey: string
}
class Main extends React.Component {
  public state: State = {
    activeKey: '0'
  }
  public onChange = (activeKey: string) => {
    this.setState({ activeKey })
  }
  public render () {
    const { activeKey } = this.state
    return (
      <div>
        <Tabs activeKey={activeKey} onChange={this.onChange}>
          <TabPane tab='喜团优选' key='0'>
            <TabItem bizSource={activeKey} />
          </TabPane>
          <TabPane tab='喜团好店' key='20'>
            <TabItem bizSource={activeKey} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Main