import React from 'react'
import { Card, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'

class Main extends React.Component {
  public columns: ColumnProps<unknown>[] = [{
    title: '服务名称',
    dataIndex: 'name'
  }, {
    title: '服务内容',
    dataIndex: 'content'
  }, {
    title: '排序',
    dataIndex: 'sort'
  }, {
    title: '操作',
    render: () => {
      return (
        <>
          <span className='href' onClick={this.handleEdit}>编辑</span>
        </>
      )
    }
  }]
  public dataSource = [{
    name: '正品保障',
    content: '杭州市西湖区古荡湾',
    sort: 7
  }]
  public handleEdit = () => {
    
  }
  public render () {
    return (
      <Card>
        <Table columns={this.columns} dataSource={this.dataSource}/>
      </Card>
    )
  }
}

export default Main