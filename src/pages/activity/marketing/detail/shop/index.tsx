import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
class Main extends React.Component {
  public columns: ColumnProps<any>[] = [
    {
      title: '商品ID'
    },
    {
      title: '商品名称'
    },
    {
      title: '库存'
    },
    {
      title: '商品ID'
    },
    {
      title: '商品ID'
    }
  ]
  public render () {
    return (
      <div>
        <div>
          <span className='href'>请选择商品</span>
        </div>
        <div>
          <Table
            style={{width: 500}}
            columns={this.columns}
          />
        </div>
      </div>
    )
  }
}
export default Main