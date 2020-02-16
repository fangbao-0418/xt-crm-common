import React from 'react'
import { Tabs } from 'antd'
import TabItem from './TabItem'
const { TabPane } = Tabs
class Main extends React.Component {
  public config: {title: string, key: number}[] = [
    {title: '全部', key: -1},
    {title: '待确认', key: 10},
    {title: '未结算', key: 20},
    {title: '待结算', key: 30},
    {title: '结算中', key: 40},
    {title: '已结算', key: 50},
    {title: '结算异常', key: 70},
    {title: '冻结', key: 80}
  ]
  public render () {
    return (
      <div style={{background: '#FFFFFF', padding: 20}}>
        <Tabs
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
