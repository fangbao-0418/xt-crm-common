import React from 'react'
import { Tabs } from 'antd'
import TabItem from './TabItem'

const { TabPane } = Tabs

interface State {
  activeKey: string
}
class Main extends React.Component<{}, State> {
  public state: State = {
    activeKey: '1'
  }
  public onChange = (activeKey: string) => {
    this.setState({ activeKey })
  }
  public render() {
    const { activeKey } = this.state
    return (
      <Tabs activeKey={activeKey} onChange={this.onChange}>
        <TabPane tab='喜团优选' key='1'>
          <TabItem type={activeKey} />
        </TabPane>
        <TabPane tab='喜团好店' key='2'>
          <TabItem type={activeKey} />
        </TabPane>
      </Tabs>
    )
  }
}

export default Main