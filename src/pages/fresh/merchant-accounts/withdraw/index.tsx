import React from 'react'
import { Tabs } from 'antd'
import Page from '@/components/page'
import { getPayload, setPayload } from '@/packages/common/utils'
import TabItem from './TabItem'

const TabPane = Tabs.TabPane

const tabConfig = [
  { title: '全部', key: 0 },
  { title: '待提现', key: 5 },
  { title: '提现成功', key: 15 },
  { title: '提现失败', key: 25 }
]

const namespace = 'fresh/merchant-accounts/withdraw-status'

class Main extends React.Component {
  public defaultActiveKey = String(getPayload(namespace) || 0)
  public render () {
    return (
      <Page>
        <Tabs
          defaultActiveKey={this.defaultActiveKey}
          onChange={(activeKey) => {
            setPayload(namespace, activeKey)
          }}
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
