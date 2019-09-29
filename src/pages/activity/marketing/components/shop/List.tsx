import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
interface State {
  dataSource?: any[]
}
interface Props {
  value?: any[]
}
class Main extends React.Component<Props> {
  public columns: ColumnProps<Shop.ShopItemProps>[] = [
    {title: '商品ID', dataIndex: 'id'},
    {title: '商品名称', dataIndex: 'productName'},
    {title: '库存', dataIndex: 'stock'},
    {title: '商品状态', dataIndex: 'status'},
    {title: '操作'}
  ]
  public state: State = {
    dataSource: this.props.value
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      dataSource: props.value
    })
  }
  public render () {
    const { dataSource } = this.state
    return (
      <div>
        <Table
          rowKey='id'
          dataSource={dataSource}
          columns={this.columns}
        />
      </div>
    )
  }
}
export default Main
