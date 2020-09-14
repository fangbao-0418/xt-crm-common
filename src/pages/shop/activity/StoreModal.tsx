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
    dataIndex: 'id'
  }, {
    title: '店铺名称',
    dataIndex: 'shopName'
  }, {
    title: '店铺状态',
    dataIndex: 'shopStatusLabel'
  }, {
    title: '店铺在架商品',
    dataIndex: 'onlineProductCount'
  }, {
    title: '店铺累计销量',
    dataIndex: 'saleProductCount	'
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
            <FormItem name='id' />
            <FormItem name='shopName' />
          </>
        )}
        tableProps={{
          rowKey: 'id',
          rowSelection: {
            selectedRowKeys,
            onChange: (keys: any[], rows: any[]) => {
              console.log('unionBy(this.rows, rows, x => x.id)', unionBy(this.rows, rows, x => x.id))
              console.log('keyskeyskeys', keys)
              this.rows = unionBy(this.rows, rows, x => x.id).filter((v: any) => keys.includes(v.id))
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