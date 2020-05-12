import React from 'react'
import { Button } from 'antd'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { FormItem } from '@/packages/common/components/form'
import { queryConfig } from './config'

class Main extends React.Component {
  list: ListPageInstanceProps
  columns = [
    {
      title: '配置编号',
      dataIndex: 'a'
    },
    {
      title: '配置名称',
      dataIndex: 'b'
    },
    {
      title: '售后类型',
      dataIndex: 'c'
    },
    {
      title: '一级类目',
      dataIndex: 'd'
    },
    {
      title: '二级类目',
      dataIndex: 'e'
    },
    {
      title: '三级类目',
      dataIndex: 'f'
    },
    {
      title: '会员等级',
      dataIndex: 'g'
    },
    {
      title: '配置金额',
      dataIndex: 'h'
    },
    {
      title: '启用状态',
      dataIndex: 'i'
    },
    {
      title: '操作',
      dataIndex: 'j'
    }
  ]
  render () {
    return (
      <ListPage
        formConfig={queryConfig}
        namespace='autoRefund'
        columns={this.columns}
        rangeMap={{
          createTime: {
            fields: ['createTimeStart', 'createTimeEnd']
          }
        }}
        formItemLayout={(
          <>
            <FormItem name='ruleId' />
            <FormItem name='status' />
            <FormItem name='category' />
            <FormItem name='createTime' />
          </>
        )}
        addonAfterSearch={(
          <div>
            <Button
              type='primary'
            >
              新增配置
            </Button>
          </div>
        )}
      />
    )
  }
}

export default Main