import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
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
            <div>{record.propertyValue1};</div>
            <div>{record.propertyValue2}</div>
          </div>
        )
      }
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      render: (text) => {
        return text
      }
    },
    {
      title: '团长价',
      dataIndex: 'headPrice',
      render: (text) => {
        return text
      }
    },
    {
      title: '合伙人价',
      dataIndex: 'cityMemberPrice',
      render: (text) => {
        return text
      }
    },
    {
      title: '管理员价',
      dataIndex: 'managerMemberPrice',
      render: (text) => {
        return text
      }
    },
    {
      title: '库存',
      dataIndex: 'stock',
      render: (text) => {
        return text
      }
    }
  ]
  public state: State = {
    selectedRowKeys: this.props.selectedRowKeys
  }
  public constructor (props: Props) {
    super(props)
    this.onSelectChange = this.onSelectChange.bind(this)
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      selectedRowKeys: props.selectedRowKeys
    })
    // if (this.state.selectedRowKeys.length === 0 && props.allSelected) {
    //   this.setState({
    //     selectedRowKeys: props.dataSource && props.dataSource.map((item) => {
    //       return item.skuId
    //     }) || []
    //   })
    // } else if (props.allSelected === false) {
    //   this.setState({
    //     selectedRowKeys: []
    //   })
    // }
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
    const { selectedRowKeys } = this.state;
    return (
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: this.onSelectChange
        }}
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
