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
              onConfirm={this.handleConfirm}
              okText="Yes"
              cancelText="No"
            >
              <Button type='danger'>删除</Button>
            </Popconfirm>
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