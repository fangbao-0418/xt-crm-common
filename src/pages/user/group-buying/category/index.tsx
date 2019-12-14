import React from 'react'
import ListPage from '@/packages/common/components/list-page'
import { getDefaultConfig } from './config'
import { Button } from 'antd'
class Main extends React.Component {
  public columns = [
    {
      title: '分类名称'
    },
    {
      title: '排序'
    },
    {
      title: '最近修改'
    },
    {
      title: '修改人'
    },
    {
      title: '是否显示'
    },
    {
      title: '操作',
      key: 'operate',
      width: 180,
      render: (text: any, records: any) => {
        return (
          <>
            <Button type='primary'>编辑</Button>
            <Button type='danger' className='ml10'>删除</Button>
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
        api={() => Promise.resolve({ records: [{}]})}
      />
    )
  }
}

export default Main