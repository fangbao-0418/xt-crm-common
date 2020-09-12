import React from 'react'
import { Modal, Input, Table } from 'antd'
import { ColumnProps } from 'antd/es/table'
import _ from 'lodash'

interface SearchPayload {
  shopName?: string
  page: number
  pageSize: number
}
interface Props {
  onOk?: (ids: any[], rows: any[]) => void
  selectedRowKeys?: any[]
}
interface State {
  visible: boolean
  selectedRowKeys: any[]
}
class Main extends React.Component<Props, State> {
  public state = {
    visible: false,
    selectedRowKeys: this.props.selectedRowKeys || []
  }
  public selectedRows: any[] = []
  public payload: SearchPayload = {
    page: 1,
    pageSize: 10
  }
  public columns: ColumnProps<any>[] = [{
    title: '店铺ID',
    dataIndex: 'shopId'
  }, {
    title: '店铺名称',
    dataIndex: 'shopName'
  }, {
    title: '在架商品',
    dataIndex: 'product'
  }, {
    title: '店铺类型',
    dataIndex: 'shopType'
  }]
  public open = () => {
    this.setState({ visible: true })
  }
  public onOk = () => {
    if (this.props.onOk) {
      this.props.onOk(this.state.selectedRowKeys, this.selectedRows)
      this.setState({
        visible: false
      })
    }
  }
  public onCancel = () => {
    this.setState({ visible: false })
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      selectedRowKeys: props.selectedRowKeys || []
    })
  }
  public fetchData = () => {
    
  }
  public debounceFetch = _.debounce(this.fetchData.bind(this), 500)
  public onSearch = (e: any) => {
    this.payload.page = 1
    this.payload.shopName = e.target.value
    this.debounceFetch()
  }
  public onrowSelectionChange (selectedRowKeys: any[], selectedRows: any[]) {
    this.selectedRows = _.unionBy(this.selectedRows, selectedRows, x => x.id).filter(x => selectedRowKeys.includes(x.id))
    this.setState({
      selectedRowKeys
    })
  }
  public render () {
    const { selectedRowKeys, visible } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onrowSelectionChange
    }
    return (
      <Modal
        title='选择店铺'
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.onOk}
        width='60%'
      >
        <div>
          <Input
            style={{ marginBottom: 20 }}
            placeholder='请选择需要搜索的店铺'
            onChange={this.onSearch}
          />
          <Table
            rowSelection={rowSelection}
            columns={this.columns}
          />
        </div>
      </Modal>
    )
  }
}

export default Main