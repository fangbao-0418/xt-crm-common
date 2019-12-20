import React from 'react'
import ListPage from '@/packages/common/components/list-page'
import { categoryLit } from './api'
import { Button, Popconfirm } from 'antd'
class Main extends React.Component {
  public columns = [
    {
      title: '分类名称',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: '排序',
      key: 'sort',
      dataIndex: 'sort'
    },
    {
      title: '最近修改时间',
      key: 'modifyTime',
      dataIndex: 'modifyTime'
    },
    {
      title: '修改人',
      key: 'modifyName',
      dataIndex: 'modifyName'
    },
    {
      title: '是否显示',
      key: 'status',
      dataIndex: 'status'
    },
    {
      title: '操作',
      key: 'operate',
      width: 180,
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
              title='你确认删除吗？'
              onConfirm={this.handleConfirm}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">Delete</a>
            </Popconfirm>
            <Button
              type='danger'
              className='ml10'
            >
              删除
            </Button>
          </>
        )
      }
    }
  ]
  public handleConfirm = () => {}

  public render () {
    return (
      <ListPage
        formConfig={{}}
        showButton={false}
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