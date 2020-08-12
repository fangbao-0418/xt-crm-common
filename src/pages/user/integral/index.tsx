import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { IntegralProps } from './interface'
import { getFieldsConfig } from './config'
import * as api from './api'

class Main extends React.Component {
  public columns: ColumnProps<IntegralProps>[] = [
    { title: '时间', dataIndex: 'modifyTime', width: 150, render: (text) => APP.fn.formatDate(text) },
    {
      title: '用户ID',
      dataIndex: 'memberId',
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
    { title: '场景', dataIndex: 'subTypeDesc', width: 100, align: 'center' },
    { title: '状态', dataIndex: 'mainType', width: 100, align: 'center' },
    {
      title: '订单号',
      dataIndex: 'bizNo',
      render: (text) => {
        return (
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
    { title: '积分', dataIndex: 'amount' },
    { title: '余额', dataIndex: 'currentAmount', render: (text) => APP.fn.formatMoneyNumber(text, 'm2u') }
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
          processData={(data) => {
            return {
              records: data.list,
              total: data.total
            }
          }}
          api={api.fetchList}
          formConfig={getFieldsConfig()}
        />
      </div>
    )
  }
}
export default Main
