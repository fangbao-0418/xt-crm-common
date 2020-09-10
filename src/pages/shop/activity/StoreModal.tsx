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
    selectedRowKeys: []
  }
  public rows: any[]
  public columns: ColumnProps<any>[] = [{
    title: '店铺id',
    dataIndex: 'shopId'
  }, {
    title: '店铺名称',
    dataIndex: 'shopName'
  }, {
    title: '店铺状态',
    dataIndex: 'shopStatus'
  }, {
    title: '店铺在架商品',
    dataIndex: 'shelfCount'
  }, {
    title: '店铺累计销量',
    dataIndex: 'salesCount'
  }, {
    title: '店铺主营类目',
    dataIndex: 'mainCategory',
    render: (text) => {
      if (Array.isArray(text) && text.length > 0) {
        return text[0].mainCategoryName
      }
      return '-'
    }
  }]
  public render () {
    const { selectedRowKeys } = this.state
    return (
      <ListPage
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