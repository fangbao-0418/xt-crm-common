import React from 'react'
import { Card, Tabs, Button, Modal, message, Row } from 'antd'
import dateFns from 'date-fns'
import {
  getGoodsList,
  delGoodsDisable,
  enableGoods,
  exportFileList,
  getCategoryTopList,
  upByGoodsId,
  cancelUpByGoodsId
} from '../api'
import { gotoPage, replaceHttpUrl } from '@/util/utils'
import Image from '@/components/Image'
import SelectFetch from '@/components/select-fetch'
import { If, ListPage, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import SuppilerSelect from '@/components/suppiler-auto-select'
import { defaultConfig } from './config'
import TabItem, { StatusType } from './TabItem'
import { getPayload, setPayload } from '@/packages/common/utils'
const { TabPane } = Tabs

interface State {
  status: StatusType
}

const tabConfigs: { key: StatusType, title: string }[] = [
  { key: '0', title: '出售中' },
  { key: '1', title: '仓库中' }
]

const namespace = 'fresh/goods/list-status'

class SkuSaleList extends React.Component<any, State> {
  state: State = {
    status: String(getPayload(namespace) || '0') as StatusType
  }
  // 切换tabPane
  handleChange = (key: string) => {
    setPayload(namespace, key)
    this.setState({
      status: key as StatusType
    })
  };
  render () {
    const { status } = this.state
    return (
      <Card>
        <Tabs
          activeKey={status}
          animated={false}
          onChange={this.handleChange}
        >
          {
            tabConfigs.map((item) => {
              return (
                <TabPane tab={item.title} key={item.key}>
                  <TabItem status={item.key} />
                </TabPane>
              )
            })
          }
        </Tabs>
      </Card>
    )
  }
}

export default SkuSaleList
