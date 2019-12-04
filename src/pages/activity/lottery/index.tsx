import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import OperateArea from './components/OperateArea'
import { Button } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { statusConfig, getDefaultConfig } from './config'
class Main extends React.Component {
  public listPage: ListPageInstanceProps
  public columns: ColumnProps<Lottery.ListProps>[] = [
    {
      key: 'id',
      title: '编号',
      dataIndex: 'id'
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
      render: (text: any) => APP.fn.formatDate(text)
    },
    {
      key: 'startTime',
      title: '开始时间',
      dataIndex: 'startTime',
      render: (text: any) => APP.fn.formatDate(text)
    },
    {
      key: 'endTime',
      title: '结束时间',
      dataIndex: 'endTime',
      render: (text: any) => APP.fn.formatDate(text)
    },
    {
      key: 'participationTimes',
      title: '参与人数',
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
      width: 280,
      render: (text: any, records: Lottery.ListProps) => <OperateArea {...records} />
    }
  ]
  public constructor (props: any) {
    super(props)
  }
  public render () {
    return (
      <ListPage
        getInstance={ref => this.listPage}
        formConfig={getDefaultConfig()}
        columns={this.columns}
        rangeMap={{
          createTime: {
            fields: ['startCreateTime', 'endCreateTime']
          },
          startTime: {
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
        api={() => Promise.resolve({
          records: [{
            id: 1,
            title: '双十二',
            type: 1,
            createTime: Date.now(),
            startTime: Date.now(),
            endTime: Date.now(),
            participationTimes: 10,
            status: 2
          }]
        })}
      />
    )
  }
}

export default Main