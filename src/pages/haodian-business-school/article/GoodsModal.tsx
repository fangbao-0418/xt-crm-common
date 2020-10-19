import React from 'react'
import { Modal } from 'antd'
import ListPage from '@/packages/common/components/list-page'
import { ColumnProps } from 'antd/lib/table'
import { unionBy } from 'lodash'
import { getProductList } from './api'
interface Props {
  onOk: (selectRows: any[]) => void
  selectedRowKeys: string[] | number[]
}
interface State {
  visible: boolean
  selectedRowKeys: string[] | number[]
}
class Main extends React.Component<Props, State> {
  public selectedRows: any[] = []
  public state = {
    visible: false,
    selectedRowKeys: []
  }
  public componentDidUpdate (prevProps: Props) {
    if (this.props.selectedRowKeys !== prevProps.selectedRowKeys) {
      this.setState({
        selectedRowKeys: this.props.selectedRowKeys
      })
    }
  }
  public columns: ColumnProps<any>[] = [{
    title: '商品ID',
    dataIndex: 'id'
  }, {
    title: '商品名称',
    dataIndex: 'productName'
  }, {
    title: '库存',
    dataIndex: 'stock',
    render: (text) => {
      return text > 10000 ? text / 10000 + '万' : text
    }
  }]
  public open = () => {
    this.setState({ visible: true })
  }
  public onOk = () => {
    this.setState({
      visible: false
    }, () => {
      this.props.onOk(this.selectedRows)
    })
  }
  public onCancel = () => {
    this.setState({
      visible: false
    })
  }
  public onRowSelectionChange = (selectedRowKeys: string[] | number[], selectedRows: any[]) => {
    const unionRows = unionBy(this.selectedRows, selectedRows, x => x.id)
    this.selectedRows = unionRows.filter((v: any) => selectedRowKeys.includes(v.id as never))
    this.setState({
      selectedRowKeys
    })
  }
  public render () {
    const { visible, selectedRowKeys } = this.state
    return (
      <Modal
        width={800}
        title='选择商品'
        visible={visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <ListPage
          tableProps={{
            rowSelection: {
              onChange: this.onRowSelectionChange,
              selectedRowKeys
            }
          }}
          processPayload={(payload) => {
            return { ...payload, channel: 2, isFilter: 0 }
          }}
          columns={this.columns}
          api={getProductList}
        />
      </Modal>
    )
  }
}

export default Main