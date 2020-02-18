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
    {title: '全部', key: -1},
    {title: '待确认', key: 10},
    {title: '可申请结算', key: 20},
    {title: '待结算', key: 30},
    {title: '结算中', key: 40},
    {title: '已结算', key: 50},
    {title: '结算异常', key: 70}
    // {title: '已冻结', key: 80}
  ]
  public defaultActiveKey = getPayload(namespace) || '0'
  public state: State = {
    activeKey: this.defaultActiveKey
  }
  public render () {
    return (
      <div style={{background: '#FFFFFF', padding: 20}}>
        <Tabs
          tabBarStyle={{marginBottom: 0}}
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
                <TabPane tab={item.title} key={String(item.key)}>
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
