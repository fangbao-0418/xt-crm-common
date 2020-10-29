import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { RecordProps } from './interface'
import { getFieldsConfig } from './config'

class Main extends React.Component {
  public columns: ColumnProps<RecordProps>[] = [
    { title: '申请单ID', dataIndex: 'supplierCashOutId' },
    { title: '金额', dataIndex: 'cashOutMoney', render: (text) => APP.fn.formatMoneyNumber(text, 'u2m') },
    { title: '供应商ID', dataIndex: 'storeId' },
    { title: '供应商名称', dataIndex: 'storeName' },
    { title: '提现方式', dataIndex: 'payType' },
    { title: '提现账户', dataIndex: 'accountName' },
    { title: '状态', dataIndex: 'status' },
    { title: '申请时间', dataIndex: '提现时间', render: (text) => APP.fn.formatDate(text) },
    { title: '操作人', dataIndex: 'operator' },
    { title: '操作时间', dataIndex: 'operateTime', render: (text) => APP.fn.formatDate(text) },
    {
      title: '操作',
      width: 140,
      align: 'center',
      render: () => {
        return (
          <div>
            <Button
              type='primary'
              size='small'
              className='mb8'
            >
              提现成功
            </Button>
            <Button
              size='small'
            >
              提现失败
            </Button>
          </div>
        )
      }
    }
  ]
  public listpage: ListPageInstanceProps
  public render () {
    return (
      <div>
        <ListPage
          columns={this.columns}
          showButton={false}
          getInstance={(ref) => {
            this.listpage = ref
          }}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.listpage.refresh()
                }}
              >
                查询
              </Button>
              <Button
                className='mr8'
                onClick={() => {
                  this.listpage.refresh(true)
                }}
              >
                取消
              </Button>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.listpage.refresh()
                }}
              >
                批量支付
              </Button>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.listpage.refresh()
                }}
              >
                批量失败
              </Button>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.listpage.refresh()
                }}
              >
                批量导出
              </Button>
              <div className='fr'>
              </div>
            </div>
          )}
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
          formConfig={getFieldsConfig()}
        />
      </div>
    )
  }
}
export default Main
