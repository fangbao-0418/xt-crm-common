import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { ColumnProps } from 'antd/lib/table'
import { IntegralProps } from './interface'
import { getFieldsConfig } from './config'
import { parseQuery } from '@/util/utils'
import * as api from './api'

class Main extends React.Component {
  public query = parseQuery() as { memberId: string }
  public columns: ColumnProps<IntegralProps>[] = [
    { title: '时间', dataIndex: 'createTime', width: 150, render: (text) => APP.fn.formatDate(text) },
    { title: '场景', dataIndex: 'subTypeDesc', width: 150, align: 'center' },
    {
      title: '订单号',
      dataIndex: 'bizNo',
      render: (text, record) => {
        // if (![11, 12].includes(record.subType)) {
        //   return null
        // }
        return text && (
          <span
            className='href'
            onClick={() => {
              APP.open(`/order/detail/${text}`)
            }}
          >
            {text}
          </span>
        )
      }
    },
    { title: '积分', dataIndex: 'amount', width: 150 },
    { title: '余额', dataIndex: 'endingBalance', width: 150, render: (text) => APP.fn.formatMoneyNumber(text, 'm2u') }
  ]
  public listpage: ListPageInstanceProps
  public render () {
    return (
      <div>
        <ListPage
          rangeMap={{
            createTime: {
              fields: ['createStartTime', 'createEndTime']
            }
          }}
          columns={this.columns}
          getInstance={(ref) => {
            this.listpage = ref
          }}
          processPayload={(payload) => {
            return {
              ...payload,
              memberId: this.query.memberId
            }
          }}
          api={api.fetchList}
        />
      </div>
    )
  }
}
export default Main
