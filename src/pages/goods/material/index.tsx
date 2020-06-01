import React from 'react'
import { Tabs } from 'antd'
import Page from '@/components/page'
import { getPayload, setPayload } from '@/packages/common/utils'
import TabItem from './TabItem'
const { TabPane } = Tabs

/** 0-所有, 1-已审核素材, 3-待审核素材 2-未通过审核素材 */
export type StatusType = '0' | '1' | '3' | '2';
const tableProps: any = {
  scroll: {
    x: true
  }
}

const tabConfigs: { key: StatusType, title: string }[] = [
  { key: '0', title: '所有' },
  { key: '1', title: '已审核素材' },
  { key: '3', title: '待审核素材' },
  { key: '2', title: '未通过审核素材' }
]

const namespace = 'goods/list-status'
class Material extends React.Component<any> {
  state = {
    status: String(getPayload(namespace) || '0') as StatusType
  }

  // 切换tabPane
  public handleChange = (key: string) => {
    setPayload(namespace, key)
    this.setState({
      status: key as StatusType
    })
  }

  render () {
    const { status } = this.state
    return (
      <Page>
        <Tabs
          activeKey={status}
          onChange={this.handleChange}
          animated={false}
        >
          {
            tabConfigs.map((item) => {
              return (
                <TabPane tab={item.title} key={item.key}>
                  {status === String(item.key) && <TabItem status={item.key} />}
                </TabPane>
              )
            })
          }
        </Tabs>
      </Page>
    )
  }
}

export default Material