import React from 'react'
import { Tabs } from 'antd'
import TabItem from './TabItem'
const { TabPane } = Tabs
class Main extends React.Component {
  public config: {title: string, key: number}[] = [
    {title: '全部', key: 1},
    {title: '待确认', key: 2},
    {title: '未结算', key: 3},
    {title: '待结算', key: 4},
    {title: '结算中', key: 5},
    {title: '已结算', key: 6},
    {title: '结算异常', key: 7}
  ]
  public render () {
    return (
      <div style={{background: '#FFFFFF', padding: 20}}>
        <Tabs
          type='card'
          tabBarStyle={{marginBottom: 0}}
        >
          {
            this.config.map((item) => {
              return (
                <TabPane tab={item.title} key={String(item.key)}>
                  <TabItem status={item.key} />
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
