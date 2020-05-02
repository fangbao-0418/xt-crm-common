import React from 'react'
import { Tabs } from 'antd'
import Page from '@/components/page'
import TabItem, { namespace } from './TabItem'

const TabPane = Tabs.TabPane

const tabConfig = [
  { title: '全部', key: 0 },
  { title: '待提现', key: 5 },
  { title: '提现成功', key: 15 },
  { title: '提现失败', key: 25 }
]

class Main extends React.Component {
  public defaultActiveKey = String(APP.fn.getPayload(namespace).status)
  public render () {
    return (
      <Page>
        <Tabs
          defaultActiveKey={this.defaultActiveKey}
        >
          {
            tabConfig.map((item) => {
              return (
                <TabPane
                  key={String(item.key)}
                  tab={item.title}
                >
                  <TabItem status={item.key as any} />
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
