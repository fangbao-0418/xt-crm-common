import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import ShopModal, { Item } from './ShopModal'
import Image from '@/components/Image'

interface Props {
  value?: any
  onChange?: (value: any) => void
}
interface State {
  selectedRowKeys: any[]
  dataSouce: Item[]
}

class Main extends React.Component<Props, State> {
  public state: State = {
    selectedRowKeys: [],
    dataSouce: this.props.value || []
  }
  public columns: ColumnProps<Item>[] = [
    {
      title: '商品ID',
      dataIndex: 'id'
    },
    {
      title: '商品名称',
      dataIndex: 'productName'
    },
    {
      title: '商品主图',
      dataIndex: 'coverUrl',
      render: (text) => {
        return (
          <Image src={text} width={80} height={80}/>
        )
      }
    },
    {
      title: '库存',
      dataIndex: 'stock'
    },
    {
      title: '操作',
      render: (text, record, index) => {
        return (
          <span
            className='href'
            onClick={() => {
              const dataSouce = this.state.dataSouce
              dataSouce.splice(index, 1)
              this.setState({
                dataSouce
              })
            }}
          >
            删除
          </span>
        )
      }
    }
  ]
  public onChange () {
    if (this.props.onChange) {
      console.log(this.state.dataSouce, 'xxxxxxxxx')
      this.props.onChange(this.state.dataSouce)
    }
  }
  public render () {
    const { selectedRowKeys, dataSouce } = this.state
    return (
      <div>
        <ShopModal
          selectedRowKeys={selectedRowKeys}
          ref="shopmodal"
          onOk={(keys, rows) => {
            console.log(rows, 'rows')
            this.setState({
              dataSouce: rows
            }, () => {
              this.onChange()
            })
          }}
        />
        <div>
          <Table
            style={{
              width: 600
            }}
            columns={this.columns}
            dataSource={dataSouce}
          />
        </div>
        <div>
          <span
            className='href'
            onClick={() => {
              const ref: any = this.refs.shopmodal;
              // ref.setState({ visible: true });
              ref.open(selectedRowKeys)
            }}
          >
            +添加商品
          </span>
        </div>
      </div>
    )
  }
}
export default Main
