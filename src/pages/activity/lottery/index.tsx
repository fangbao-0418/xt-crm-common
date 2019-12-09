import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import Ribbon from './components/Ribbon'
import { Button } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { statusConfig, getDefaultConfig, formatDate } from './config'
import * as api from './api'

class Main extends React.Component {
  public listPage: ListPageInstanceProps
  public columns: ColumnProps<Lottery.ListProps>[] = [
    {
      key: 'id',
      title: '活动id',
      dataIndex: 'id',
      width: 80,
      align: 'center'
    },
    {
      key: 'title',
      title: '活动名称',
      dataIndex: 'title'
    },
    {
      key: 'type',
      title: '活动类型',
      dataIndex: 'type'
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      render: formatDate
    },
    {
      key: 'startTime',
      title: '开始时间',
      dataIndex: 'startTime',
      render: formatDate
    },
    {
      key: 'endTime',
      title: '结束时间',
      dataIndex: 'endTime',
      render: formatDate
    },
    {
      key: 'participationTimes',
      title: '参与人次',
      dataIndex: 'participationTimes'
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (status: any) => statusConfig[status]
    },
    {
      key: 'operate',
      title: '操作',
      width: 220,
      render: (text: any, record: Lottery.ListProps) => {
        const path = `/activity/lottery/${record.id}`
        return (
          <Ribbon
            status={record.status}
            onView={() => APP.history.push(`${path}?readOnly=1`)}
            onEdit={() => APP.history.push(path)}
            onDelete={async () => {
              const res = await api.deleteActivity(record.id)
              if (res) {
                APP.success('删除成功')
                this.listPage.refresh()
              }
            }}
            onUpdate={async (open: 0 | 1) => {
              const res = await api.updateActivityStatus({
                open,
                luckyDrawId: record.id
              })
              if (res) {
                const msg = open === 1 ? '开启成功' : '关闭成功' 
                APP.success(msg)
                this.listPage.refresh()
              }
            }}
          />
        )
      }
    }
  ]
  public constructor (props: any) {
    super(props)
  }
  public render () {
    return (
      <ListPage
        getInstance={ref => this.listPage = ref}
        formConfig={getDefaultConfig()}
        columns={this.columns}
        rangeMap={{
          createTime: {
            fields: ['startCreateTime', 'endCreateTime']
          },
          beginTime: {
            fields: ['startBeginTime', 'endBeginTime']
          }
        }}
        addonAfterSearch={(
          <Button
            type='danger'
            onClick={() => APP.history.push('/activity/lottery/-1')}
          >
            新建活动
          </Button>
        )}
        api={api.getPage}
      />
    )
  }
}

export default Main