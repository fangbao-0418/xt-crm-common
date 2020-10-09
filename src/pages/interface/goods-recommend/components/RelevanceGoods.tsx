import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import GoodsModal, { Item } from './GoodsModal'
import Image from '@/components/Image'

interface Props {
  readonly?: boolean
  value?: any
  onChange?: (value: any) => void
  channel: 1 | 2
}
interface State {
  selectedRowKeys: any[]
  dataSource: Item[]
}

class Main extends React.Component<Props, State> {
  public state: State = {
    selectedRowKeys: [],
    dataSource: this.props.value || []
  }
  public columns: ColumnProps<Item>[] = [
    {
      title: '商品ID',
      dataIndex: 'productId'
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
        const { readonly } = this.props
        return readonly ? null : (
          <span
            className='href'
            onClick={() => {
              const dataSource = this.state.dataSource
              dataSource.splice(index, 1)
              this.setState({
                dataSource
              })
            }}
          >
            删除
          </span>
        )
      }
    }
  ]
  public componentWillReceiveProps (props: Props) {
    this.setState({
      dataSource: props.value || []
    })
  }
  public onChange () {
    if (this.props.onChange) {
      this.props.onChange(this.state.dataSource)
    }
  }
  public render () {
    const { selectedRowKeys, dataSource } = this.state
    const { readonly, channel } = this.props
    return (
      <div>
        <GoodsModal
          fetchNode='open'
          channel={channel}
          selectedRowKeys={selectedRowKeys}
          ref='goodsmodal'
          onOk={(keys, rows) => {
            const result = rows.map((item) => {
              return {
                ...item
              }
            })
            this.setState({
              dataSource: result
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
            dataSource={dataSource}
          />
        </div>
        <div>
          {!readonly && (
            <span
              className='href'
              onClick={() => {
                const ref: any = this.refs.goodsmodal
                ref.open(this.state.dataSource)
              }}
            >
              +添加商品
            </span>
          )}
        </div>
      </div>
    )
  }
}
export default Main
