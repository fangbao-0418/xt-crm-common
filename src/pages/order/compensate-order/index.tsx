import React from 'react'
import { Button } from 'antd'
import { If, ListPage, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig } from './config'
import { OrderProps } from './interface'
import { getOrderlist } from './api'

class Main extends React.Component {
  list: ListPageInstanceProps
  columns: ColumnProps<OrderProps>[] = [
    {
      title: '补偿单编号',
      dataIndex: 'a',
      fixed: 'left'
    },
    {
      title: '订单编号',
      dataIndex: 'b'
    },
    {
      title: '订单商品',
      dataIndex: 'c'
    },
    {
      title: '商品ID',
      dataIndex: 'd'
    },
    {
      title: '供应商',
      dataIndex: 'e'
    },
    {
      title: '店铺名称',
      dataIndex: 'f'
    },
    {
      title: '状态',
      dataIndex: 'g'
    },
    {
      title: '类型',
      dataIndex: 'h'
    },
    {
      title: '金额',
      dataIndex: 'i'
    },
    {
      title: '责任归属',
      dataIndex: 'j'
    },
    {
      title: '用户手机',
      dataIndex: 'k'
    },
    {
      title: '创建人',
      dataIndex: 'i'
    },
    {
      title: '申请时间',
      dataIndex: 'j'
    },
    {
      title: '最后处理时间',
      dataIndex: 'k'
    },
    {
      title: '操作',
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <span
              className='href'
              onClick={() => { APP.history.push(`/order/compensate-order/${record.id}`) }}
            >
              查看详情
            </span>
          </>
        )
      }
    }
  ]
  render () {
    return (
      <ListPage
        reserveKey='/order/compensate-order'
        formConfig={getFieldsConfig()}
        columns={this.columns}
        api={getOrderlist}
        tableProps={{
          scroll: {
            x: true
          }
        }}
        addonAfterSearch={(
          <>
            <Button
              type='primary'
              className='mr8'
            >
              导出商品
            </Button>
          </>
        )}
      />
    )
  }
}

export default Main
