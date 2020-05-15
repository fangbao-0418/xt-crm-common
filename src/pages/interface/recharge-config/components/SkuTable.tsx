import React from 'react'
import { Table } from 'antd'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import styles from './style.module.sass'
interface State {
  selectedRowKeys: number[]
}
interface Props {
  allSelected?: boolean
  dataSource: Shop.SkuProps[]
  selectedRowKeys?: number[]
  onSelect?: (selectedRowKeys: number[], selectedRows?: Shop.SkuProps[]) => void
}
class Main extends React.Component<Props, State> {
  public columns: ColumnProps<Shop.SkuProps>[] = [
    {
      title: '规格',
      render: (text, record) => {
        return (
          <div>
            {record.propertyValue}
          </div>
        )
      }
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      render: (text) => {
        return APP.fn.formatMoneyNumber(text, 'm2u')
      }
    },
    {
      title: '市场价',
      dataIndex: 'marketPrice',
      render: (text) => {
        return APP.fn.formatMoneyNumber(text, 'm2u')
      }
    },
    {
      title: '销售价',
      dataIndex: 'salePrice',
      render: (text) => {
        return APP.fn.formatMoneyNumber(text, 'm2u')
      }
    }
  ]
  public state: State = {
    selectedRowKeys: this.props.selectedRowKeys || []
  }
  public constructor (props: Props) {
    super(props)
    this.onSelectChange = this.onSelectChange.bind(this)
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      selectedRowKeys: props.selectedRowKeys || []
    })
  }
  public onSelectChange (selectedRowKeys: any[], selectedRows: Shop.SkuProps[]) {
    this.setState({
      selectedRowKeys
    }, () => {
      if (this.props.onSelect) {
        this.props.onSelect(selectedRowKeys, selectedRows)
      }
    })
  }
  public render () {
    const { dataSource } = this.props
    const { selectedRowKeys } = this.state
    const rowSelection: TableRowSelection<Shop.SkuProps> = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }
    return (
      <Table
        rowSelection={rowSelection}
        bordered
        className={styles['sku-table']}
        rowKey='skuId'
        columns={this.columns}
        dataSource={dataSource}
        pagination={false}
      />
    )
  }
}
export default Main
