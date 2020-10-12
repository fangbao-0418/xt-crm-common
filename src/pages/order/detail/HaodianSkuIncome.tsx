import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/es/table'

class Main extends React.Component {
  public columns: ColumnProps<any>[] = [{
    title: '姓名',
    dataIndex: 'nickName'
  }, {
    title: '手机号',
    dataIndex: 'popPhone'
  }, {
    title: '类别',
    dataIndex: 'type'
  }, {
    title: '收益类型',
    dataIndex: 'settlementTypeDesc'
  }]
  public render () {
    return (
      <Table
        columns={this.columns}
      />
    )
  }
}

export default Main