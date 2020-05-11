import React from 'react'
import Page from '@/components/page'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { RecordProps } from './interface'
import { getFieldsConfig } from './config'
import SelectModal from './components/SelectModal'

class Main extends React.Component {
  public columns: ColumnProps<RecordProps>[] = [
    { title: '商品', dataIndex: 'supplierCashOutId' },
    { title: '商品ID', dataIndex: 'productId', render: (text) => APP.fn.formatMoneyNumber(text, 'u2m') },
    { title: 'SKUID', dataIndex: 'storeId' },
    { title: '商品名称', dataIndex: 'storeName' },
    { title: '商品主图', dataIndex: 'payType' },
    { title: '库存', dataIndex: 'accountName' },
    { title: '排序', dataIndex: 'status' }
  ]
  public listpage: ListPageInstanceProps
  public selector: SelectModal
  public render () {
    return (
      <Page>
        <SelectModal
          getInstance={(ref) => {
            this.selector = ref
          }}
        />
        <div className='mb8'>
          <Button
            type='danger'
            onClick={() => {
              this.selector.open()
            }}
          >
            请选择商品
          </Button>
        </div>
        <ListPage
          style={{ margin: '0' }}
          columns={this.columns}
          showButton={false}
          getInstance={(ref) => {
            this.listpage = ref
          }}
          api={() => {
            return Promise.resolve({
              total: 0,
              records: [
                {
                  supplierCashOutId: '2222'
                }
              ]
            })
          }}
        />
      </Page>
    )
  }
}
export default Main
