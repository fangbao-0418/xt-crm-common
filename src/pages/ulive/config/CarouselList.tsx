import React from 'react'
import ListPage from '@/packages/common/components/list-page'
class Main extends React.Component {
  public columns: any[] = [
    {
      title: '场次ID',
      dataIndex: '场次ID',
      width: 150
    },
    {
      title: '直播标题',
      dataIndex: '直播标题'
    },
    {
      title: '状态',
      dataIndex: '状态'
    },
    {
      title: '排序',
      dataIndex: '排序'
    },
    {
      title: '操作',
      dataIndex: '操作',
      render: () => {
        return (
          <div>
            <span className='href'>
              修改
            </span>&nbsp;&nbsp;
            <span className='href'>
              删除
            </span>
          </div>
        )
      }
    }
  ]
  public render () {
    return (
      <div>
        <ListPage
          columns={this.columns}
          api={() => {
            return Promise.resolve({})
          }}
        />
      </div>
    )
  }
}
export default Main