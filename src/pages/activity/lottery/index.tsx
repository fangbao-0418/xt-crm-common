import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { getDefaultConfig } from './config'
interface Lottery {
  id: number
  name: string
  type: number
  createTime: number
  beginTime: number
  endTime: number
  num: number
  status: number
}
class Main extends React.Component {
  public listPage: ListPageInstanceProps
  public columns: ColumnProps<Lottery>[] = [
    {
      key: 'id',
      title: '编号',
      dataIndex: 'id'
    },
    {
      key: 'name',
      title: '活动名称',
      dataIndex: 'name'
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
      key: 'beginTime',
      title: '开始时间',
      dataIndex: 'beginTime',
      render: (text: any) => APP.fn.formatDate(text)
    },
    {
      key: 'endTime',
      title: '结束时间',
      dataIndex: 'endTime',
      render: (text: any) => APP.fn.formatDate(text)
    },
    {
      key: 'num',
      title: '参与人数',
      dataIndex: 'num'
    },
    {
      key: 'operate',
      title: '状态',
      render: (text: any, record: Lottery, index: number) => {
        return (
          <div>
            <Button type='link'>查看</Button>
            <Button
              type='link'
              onClick={() => {
                APP.history.push(`/activity/lottery/${record.id}`)
              }}
            >编辑</Button>
            <Button type='link'>上线</Button>
          </div>
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
        getInstance={ref => this.listPage}
        formConfig={getDefaultConfig()}
        columns={this.columns}
        rangeMap={{
          createTime: {
            fields: ['createStartTime', 'createEndTime']
          },
          beginTime: {
            fields: ['beginStartTime', 'beginEndTime']
          }
        }}
        addonAfterSearch={<Button type='danger'>新建活动</Button>}
        api={() => Promise.resolve({
          records: [{
            id: 1,
            name: '双十二',
            type: 1,
            createTime: Date.now(),
            beginTime: Date.now(),
            endTime: Date.now(),
            num: 10,
            status: 2
          }]
        })}
      />
    )
  }
}

export default Main