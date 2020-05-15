import React from 'react'
import List, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { categoryLit, deleteCategory } from './api'
import { Card, Button, Popconfirm } from 'antd'
class Main extends React.Component {
  public list: ListPageInstanceProps
  public columns = [
    {
      title: '分类名称',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: '排序',
      key: 'sort',
      dataIndex: 'sort',
      width: '15%'
    },
    {
      title: '最近修改时间',
      key: 'modifyTime',
      dataIndex: 'modifyTime',
      width: '15%'
    },
    {
      title: '修改人',
      key: 'modifyName',
      dataIndex: 'modifyName',
      width: '15%'
    },
    {
      title: '是否显示',
      key: 'status',
      dataIndex: 'status',
      width: '15%'
    },
    {
      title: '操作',
      key: 'operate',
      width: 220,
      render: (text: any, records: any) => {
        return (
          <>
            <Button
              type='primary'
              onClick={() => APP.history.push(`/interface/group-buying/category/${records.id}`)}
            >
              编辑
            </Button>
            <Popconfirm
              className='ml10'
              title='你确认删除吗？'
              onConfirm={async () => {
                const res = await deleteCategory(records.id)
                if (res) {
                  APP.success('删除分类成功')
                  this.list.refresh()
                }
              }}
              okText='确认'
              cancelText='取消'
            >
              <Button type='danger'>删除</Button>
            </Popconfirm>
          </>
        )
      }
    }
  ]

  public render () {
    return (
      <Card>
        <div>
          <Button
            type='danger'
            onClick={() => {
              APP.history.push('/interface/group-buying/category/-1')
            }}>
            添加分类
          </Button>
        </div>
        <List
          reserveKey='/interface/group-buying/category'
          columns={this.columns}
          className='mt10'
          getInstance={ref => this.list = ref}
          api={categoryLit}
        />
      </Card>
    )
  }
}

export default Main