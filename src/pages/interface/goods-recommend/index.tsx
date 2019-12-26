import React from 'react'
import { Button } from 'antd'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import * as api from './api'
import { getFieldsConfig } from './config'
import { ColumnProps } from 'antd/lib/table'
export interface Item {
  id: number
  createTime: number
  startTime: number
  location: number
  name: string
  pageNo: number
  pageSize: number
  status: number
}
class Main extends React.Component {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<Item>[] = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '位置',
      dataIndex: 'location'
    },
    {
      title: '用户端',
      dataIndex: 'location'
    },
    {
      title: '状态',
      dataIndex: 'status'
    },
    {
      title: '创建时间',
      dataIndex: 'startTime'
    },
    {
      title: '有效时间',
      dataIndex: 'location'
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <>
            <span
              className='href mr10'
              onClick={() => { APP.history.push(`/interface/goods-recommend/${record.id}`) }}
            >
              编辑
            </span>
            <span
              className='href'
            >
              失效
            </span>
          </>
        )
      }
    }
  ]
  public render () {
    return (
      <div
        style={{
          padding: 20,
          background: '#FFFFFF'
        }}
      >
        <ListPage
          addonAfterSearch={(
            <div>
              <Button
                onClick={() => {
                  APP.history.push('/interface/goods-recommend/-1')
                }}
              >
                新增
              </Button>
            </div>
          )}
          formConfig={getFieldsConfig()}
          processPayload={(payload) => {
            return {
              ...payload,
              pageNo: payload.page,
              page: undefined
            }
          }}
          api={api.fetchList}
          columns={this.columns}
        />
      </div>
    )
  }
}
export default Main
