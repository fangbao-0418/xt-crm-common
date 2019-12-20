import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { categoryLit, deleteCategory } from './api'
import { Button, Popconfirm } from 'antd'
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
              onClick={() => APP.history.push(`/user/group-buying/category/${records.id}`)}
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
      <ListPage
        formConfig={{}}
        showButton={false}
        getInstance={ref => this.list = ref}
        addonAfterSearch={(
          <Button
            type='danger'
            onClick={() => {
              APP.history.push('/user/group-buying/category/-1')
            }}>
            添加分类
          </Button>
        )}
        columns={this.columns}
        api={categoryLit}
      />
    )
  }
}

export default Main