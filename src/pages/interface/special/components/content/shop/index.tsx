import React from 'react'
import { Table, Input } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import styles from './style.module.sass'
interface Props {
  dataSource: Shop.ShopItemProps[]
  onChange: (dataSource: Shop.ShopItemProps[]) => void
}
class Main extends React.Component<Props> {
  public columns: ColumnProps<Shop.ShopItemProps>[] = [
    {
      title: '商品ID',
      dataIndex: 'id',
      width: 100
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      width: 200
    },
    {
      title: '商品主图',
      dataIndex: 'coverUrl',
      render: (text) => {
        return (
          <img src={text} width={80} height={80}/>
        )
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      align: 'center',
      render: (text, record, index) => {
        const { dataSource } = this.props
        return (
          <Input
            value={text}
            onChange={(e) => {
              dataSource[index].sort = e.target.value
              if (this.props.onChange) {
                this.props.onChange(dataSource)
              }
            }}
          />
        )
      }
    },
  ]
  public render () {
    return (
      <Table
        size={'small'}
        style={{width: '100%'}}
        columns={this.columns}
        dataSource={this.props.dataSource}
        pagination={{
          showTotal: (total) => {
            return <span>共计{total}条</span>
          }
        }}
      >
      </Table>
    )
  }
}
export default Main