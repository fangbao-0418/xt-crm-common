import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { ColumnProps } from 'antd/lib/table'
import { IntegralProps } from './interface'
import { getFieldsConfig } from './config'
import * as api from './api'

class Main extends React.Component {
  public columns: ColumnProps<IntegralProps>[] = [
    { title: '时间', dataIndex: 'createTime', width: 150, render: (text) => APP.fn.formatDate(text) },
    {
      title: '用户ID',
      dataIndex: 'memberId',
      width: 150,
      render: (text) => {
        return (
          <span
            className='href'
            onClick={() => {
              APP.open(`/user/detail?memberId=${text}`)
            }}
          >
            {text}
          </span>
        )
      }
    },
    { title: '场景', dataIndex: 'subTypeDesc', width: 200 },
    {
      title: '订单号',
      dataIndex: 'bizNo',
      render: (text, record) => {
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
          api={api.fetchList}
          formConfig={getFieldsConfig()}
        />
      </div>
    )
  }
}
export default Main
