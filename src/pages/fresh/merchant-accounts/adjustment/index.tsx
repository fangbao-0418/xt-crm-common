import React from 'react'
import { Tabs } from 'antd'
import TabItem from './TabItem'
import { getPayload, setPayload } from '@/packages/common/utils'
const { TabPane } = Tabs
const namespace = 'adjustment'
interface State {
  activeKey: string
}
class Main extends React.Component<{}, State> {
  public config: {title: string, key: number}[] = [
    { title: '全部', key: 0 },
    { title: '初审', key: 10 },
    { title: '复审', key: 20 },
    { title: '审核通过', key: 30 },
    { title: '审核不通过', key: 40 },
    { title: '已撤销', key: 50 }
  ]
  public defaultActiveKey = getPayload(namespace) || '0'
  public state: State = {
    activeKey: this.defaultActiveKey
  }
  public render () {
    return (
      <div style={{ background: '#FFFFFF', padding: 20 }}>
        <Tabs
          // type='card'
          tabBarStyle={{ marginBottom: 0 }}
          defaultActiveKey={this.defaultActiveKey}
          onChange={(activeKey) => {
            setPayload(namespace, activeKey)
            this.setState({
              activeKey
            })
          }}
        >
          {
            this.config.map((item) => {
              return (
                <TabPane
                  tab={item.title}
                  key={String(item.key)}
                >
                  {
                    this.state.activeKey === String(item.key) && (
                      <TabItem
                        status={item.key}
                      />
                    )}
                </TabPane>
              )
            })
          }
        </Tabs>
      </div>
    )
  }
}
export default Main
