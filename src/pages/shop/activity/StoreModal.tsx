import React from 'react'
import { ListPage, FormItem } from '@/packages/common/components'
import { ColumnProps } from 'antd/lib/table'
import { getDefaultConfig } from './config'

interface State {
  selectedRowKeys: string[] | number[]
}
class Main extends React.Component {
  public state = {
    selectedRowKeys: []
  }
  public columns: ColumnProps<any>[] = [{
    title: '店铺id',
    dataIndex: 'shopId'
  }, {
    title: '店铺名称',
    dataIndex: 'shopName'
  }, {
    title: '店铺状态',
    dataIndex: 'status'
  }, {
    title: '店铺在架商品',
    dataIndex: 'productId'
  }, {
    title: '店铺累计销量',
    dataIndex: 'nums'
  }, {
    title: '店铺主营类目',
    dataIndex: 'category'
  }]
  public render () {
    const { selectedRowKeys } = this.state
    return (
      <ListPage
        columns={this.columns}
        formConfig={getDefaultConfig()}
        namespace='addFormConfig'
        formItemLayout={(
          <>
            <FormItem name='shopId' />
            <FormItem name='shopName' />
          </>
        )}
        tableProps={{
          rowSelection: {
            selectedRowKeys,
            onChange: (keys) => {
              this.setState({ selectedRowKeys: keys })
            }
          }
        }}
      />
    )
  }
}

export default Main