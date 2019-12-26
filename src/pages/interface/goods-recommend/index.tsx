import React from 'react'
import { Button } from 'antd'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import * as api from './api'
import { getFieldsConfig, StatusEnum, locationMap, displayFromMap } from './config'
import { ColumnProps } from 'antd/lib/table'
import { FormItem } from '@/packages/common/components'
export interface Item {
  id: number
  createTime: number
  startTime: number
  endTime: number
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
      dataIndex: 'location',
      render: (text) => {
        return locationMap.label[text]
      }
    },
    {
      title: '用户端',
      dataIndex: 'displayFrom',
      render: (text) => {
        return displayFromMap.label[text]
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 200,
      render: (text) => {
        return StatusEnum[text]
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      align: 'center',
      render: (text) => {
        return APP.fn.formatDate(text) || ''
      }
    },
    {
      title: '有效时间',
      dataIndex: 'startTime',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return (
          <>
            <div>{APP.fn.formatDate(record.startTime)}</div>
            <div>至</div>
            <div>{APP.fn.formatDate(record.endTime)}</div>
          </>
        )
      }
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <>
            <span
              className='href mr10'
              onClick={() => { APP.history.push(`/interface/goods-recommend/${record.id}`) }}
            >
              {record.status !== 0 ? '编辑' : '查看'}
            </span>
            {record.status !== 0 && (
              <span
                className='href'
                onClick={() => {
                  this.disabled(record)
                }}
              >
                失效
              </span>
            )}
          </>
        )
      }
    }
  ]
  public disabled (record: Item) {
    api.disabled(record.id).then(() => {
      this.listpage.refresh()
    })
  }
  public render () {
    return (
      <div
        style={{
          padding: 20,
          background: '#FFFFFF'
        }}
      >
        <ListPage
          rangeMap={{
            date: {
              fields: ['createEndTime', 'createStartTime']
            }
          }}
          formItemLayout={(
            <>
              <FormItem name='name' />
              <FormItem name='location' type='select' />
              <FormItem name='status' />
              <FormItem label='创建时间' name='date' />
            </>
          )}
          getInstance={(ref) => {
            this.listpage = ref
          }}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
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
