import React from 'react'
import { Tabs } from 'antd'
import TabItem from './TabItem'

const { TabPane } = Tabs

interface State {
  channel: string
}
class Main extends React.Component<{}, State> {
  public state: State = {
    channel: '1'
  }
  public onChange = (channel: string) => {
    this.setState({ channel })
  }
  public render() {
    const { channel } = this.state
    return (
      <Tabs activeKey={channel} onChange={this.onChange}>
        <TabPane tab='喜团优选' key='1'>
          <TabItem channel={channel} />
        </TabPane>
        <TabPane tab='喜团好店' key='2'>
          <TabItem channel={channel} />
        </TabPane>
      </Tabs>
    )
  }
}

export default Main