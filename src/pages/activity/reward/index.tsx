import React from 'react'
import List from '@/packages/common/components/list-page'
import { Button } from 'antd'
import { getDefaultConfig, statusEnum } from './config'
import { ColumnProps } from 'antd/es/table'
class Main extends React.Component {
  public columns: any[] = [{
    title: '中奖号码',
  }, {
    title: '活动名称',
  }, {
    title: '活动类型',
  }, {
    title: '主订单号',
  }, {
    title: '手机号',
  }, {
    title: '支付时间',
  }, {
    title: '抽奖时间',
  }, {
    title: '状态',
  }, {
    title: '奖品类型',
  }, {
    title: '操作',
  }]
  public render () {
    return (
      <List
        formConfig={getDefaultConfig()}
        addonAfterSearch={(
          <div>
            <Button type='danger'>补发</Button>
            <Button className='ml10'>失效</Button>
          </div>
        )}
        columns={this.columns}
        api={() => Promise.resolve({ records: []})}
      />
    )
  }
}

export default Main