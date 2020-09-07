import React from 'react'
import { ListPage, FormItem } from '@/packages/common/components'
import { ColumnProps } from 'antd/es/table'
import { getDefaultConfig } from './config'
import { Button } from 'antd'

interface Props {
  type: string
}
class Main extends React.Component<Props, {}> {
  public columns: ColumnProps<any>[] = [{
    title: '活动编号',
    dataIndex: 'no'
  }, {
    title: '活动名称',
    dataIndex: 'name'
  }, {
    title: '报名时间',
    dataIndex: 'signUpTime'
  }, {
    title: '预热时间',
    dataIndex: 'preheatingTime'
  }, {
    title: '活动排期时间',
    dataIndex: 'schedulingTime'
  }, {
    title: '活动状态',
    dataIndex: 'status'
  }, {
    title: '供应商id',
    dataIndex: 'supplierId'
  }, {
    title: '供应商名称',
    dataIndex: 'supplierName'
  }, {
    title: '活动报名商品',
    render: (records) => {
      return (
        <>
          <div>全部商品：100个</div>
          <div>sku：130个</div>
          <div>通过sku：100个</div>
        </>
      )
    }
  }, {
    title: '排序',
    dataIndex: 'sort'
  }, {
    title: '创建人',
    dataIndex: 'createPerson'
  }, {
    title: '操作',
    render: () => {
      return (
        <>
          <span
            className='href'
            onClick={() => {
              APP.history.push('/shop/detail')
            }}
          >
            编辑
          </span>
          <span className='href ml10'>发布</span>
          <span className='href ml10'>复制</span>
          <span
            className='href ml10'
            onClick={() => {
              APP.history.push('/shop/activity/detail')
            }}
          >查看详情</span>
          <span className='href ml10'>排序</span>
        </>
      )
    }
  }]
  public render() {
    return (
      <ListPage
        formConfig={getDefaultConfig()}
        formItemLayout={(
          <>
            <FormItem name='name' />
            <FormItem name='status' />
            <FormItem name='schedulingTime' />
            <FormItem name='no' />
            <FormItem name='createPerson' />
          </>
        )}
        addonAfterSearch={(
          <Button
            type='primary'
            onClick={() => {
              APP.history.push('/shop/activity/add')
            }}>
              新建活动
            </Button>
        )}
        columns={this.columns}
        api={async () => {
          return {
            records: [{}]
          }
        }}
      />
    )
  }
}

export default Main