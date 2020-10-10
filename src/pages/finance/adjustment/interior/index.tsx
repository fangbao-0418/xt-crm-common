import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { RecordProps } from './interface'
import { getFieldsConfig } from './config'

class Main extends React.Component {
  public columns: ColumnProps<RecordProps>[] = [
    { title: '账务结算ID', dataIndex: 'supplierCashOutId', width: 150 },
    { title: '收支类型', dataIndex: 'cashOutMoney', width: 100, render: (text) => APP.fn.formatMoneyNumber(text, 'u2m') },
    { title: '账务金额', dataIndex: 'storeId', width: 100 },
    { title: '账务对象类型', dataIndex: 'storeName', width: 150 },
    { title: '账务对象ID', dataIndex: 'payType', width: 150 },
    { title: '账务对象名称', dataIndex: 'accountName', width: 150 },
    { title: '原因', dataIndex: 'status', width: 100 },
    { title: '创建方式', dataIndex: '提现时间', width: 100, render: (text) => APP.fn.formatDate(text) },
    { title: '审核状态', dataIndex: 'operator', width: 100 },
    { title: '结算状态', dataIndex: 'operator', width: 100 },
    { title: '创建时间', dataIndex: 'operateTime', width: 200, render: (text) => APP.fn.formatDate(text) },
    { title: '创建人', dataIndex: 'operator', width: 100 },
    { title: '审核完成时间', dataIndex: 'operateTime', width: 200, render: (text) => APP.fn.formatDate(text) },
    { title: '操作人', dataIndex: 'operator', width: 100 },
    {
      title: '操作',
      width: 140,
      align: 'center',
      render: () => {
        return (
          <div>
            <span className='href'>审核</span>
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
          tableProps={{
            scroll: {
              x: 1000
            }
          }}
        />
      </div>
    )
  }
}
export default Main
