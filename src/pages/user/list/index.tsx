import React from 'react'
import { Tabs } from 'antd'
import TabItem from './TabItem'

const tabConfig =  [{
  label: '喜团优选',
  value: '0'
}, {
  label: '喜团好店',
  value: '20'
}]

interface State {
  bizSource: string
}
class Main extends React.Component<{}, State> {
  public ref: any
  public constructor (props: any) {
    super(props)
    this.ref = React.createRef();
  }
  public state = {
    bizSource: '0'
  }
  public tabInstance: any
  public render () {
    const { bizSource } = this.state
    const { TabPane } = Tabs
    return (
      <Tabs
        activeKey={bizSource}
        onChange={(key) => {
          this.setState({ bizSource: key }, () => {
            // this.tabInstance.handleSearch()
            console.log('this.tabInstance', this.tabInstance)
            this.tabInstance.handleSearch()
          })
        }}
      >
        {tabConfig.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <TabItem
              bizSource={bizSource}
              getInstance={(ref: any) => {
                this.tabInstance = ref
              }}
            />
          </TabPane>
        ))}
      </Tabs>
    )
  }
}

export default Main