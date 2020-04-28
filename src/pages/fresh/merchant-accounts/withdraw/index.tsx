import React from 'react'
import { Tabs } from 'antd'
import Page from '@/components/page'
import TabItem from './TabItem'

const TabPane = Tabs.TabPane

const tabConfig = [
  { title: '全部', key: 0 },
  { title: '待提现', key: 1 },
  { title: '提现成功', key: 2 },
  { title: '提现失败', key: 3 }
]

class Main extends React.Component {
  public render () {
    console.log('withdraw')
    return (
      <Page>
        <Tabs>
          {
            tabConfig.map((item) => {
              return (
                <TabPane
                  key={String(item.key)}
                  tab={item.title}
                >
                  <TabItem />
                </TabPane>
              )
            })
          }
        </Tabs>
      </Page>
    )
  }
}
export default Main
