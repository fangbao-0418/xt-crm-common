import React from 'react'
import { ListPage, FormItem } from '@/packages/common/components'
import { ColumnProps } from 'antd/lib/table'
import { getDefaultConfig } from './config'
import { getShopList } from './api'
import { unionBy } from 'lodash'
interface Props {
  onChange: (rows: any[]) => void
}
interface State {
  selectedRowKeys: string[] | number[]
}
class Main extends React.Component<Props, State> {
  public state = {
    selectedRowKeys: [],
  }
  public rows: any[] = []
  public columns: ColumnProps<any>[] = [{
    title: '店铺id',
    dataIndex: 'shopId'
  }, {
    title: '店铺名称',
    dataIndex: 'shopName'
  }, {
    title: '店铺状态',
    dataIndex: 'shopStatusLabel'
  }, {
    title: '店铺主营类目',
    dataIndex: 'mainProductCategoryName'
  }]
  public render () {
    const { selectedRowKeys } = this.state
    return (
      <ListPage
        processPayload={(payload) => {
          payload.bizType = 4
          payload.shopStatusList = [2]
          return payload
        }}
        columns={this.columns}
        api={getShopList}
        formConfig={getDefaultConfig()}
        namespace='addFormConfig'
        formItemLayout={(
          <>
            <FormItem name='shopId' />
            <FormItem name='shopName' />
          </>
        )}
        tableProps={{
          rowKey: 'shopId',
          rowSelection: {
            selectedRowKeys,
            onChange: (keys: any[], rows: any[]) => {
              this.rows = unionBy(this.rows, rows, x => x.shopId).filter((v: any) => keys.includes(v.shopId))
              this.setState({ selectedRowKeys: keys })
              this.props.onChange(this.rows)
            }
          }
        }}
      />
    )
  }
}

export default Main