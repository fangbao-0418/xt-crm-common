import React from 'react'
import { Modal, Input, Table } from 'antd'
import { ColumnProps } from 'antd/es/table'
import _ from 'lodash'

interface SearchPayload {
  shopName?: string
  page: number
  pageSize: number
}
interface State {
  visible: boolean
  selectedRowKeys: any[]
}
class Main extends React.Component<{}, State> {
  public state = {
    visible: false,
    selectedRowKeys: []
  }
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
  public onCancel = () => {
    this.setState({ visible: false })
  }
  public fetchData = () => {
    
  }
  public debounceFetch = _.debounce(this.fetchData.bind(this), 500)
  public onSearch = (e: any) => {
    this.payload.page = 1
    this.payload.shopName = e.target.value
    this.debounceFetch()
  }
  public render () {
    const { selectedRowKeys, visible } = this.state
    const rowSelection = {
      selectedRowKeys
    }
    return (
      <Modal
        title='选择店铺'
        visible={visible}
        onCancel={this.onCancel}
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