import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { RecordProps } from './interface'
import { getFieldsConfig } from './config'

class Main extends React.Component {
  public columns: ColumnProps<RecordProps>[] = [
    { title: '对账单ID', dataIndex: 'supplierCashOutId' },
    { title: '日期', dataIndex: 'cashOutMoney', render: (text) => APP.fn.formatMoneyNumber(text, 'u2m') },
    { title: '供应商ID', dataIndex: 'storeId' },
    { title: '供应商', dataIndex: 'storeName' },
    { title: '收入（元）', dataIndex: 'payType' },
    { title: '支出（元）', dataIndex: 'accountName' },
    { title: '本期对账单金额', dataIndex: 'status' },
    { title: '状态', dataIndex: '提现时间', render: (text) => APP.fn.formatDate(text) },
    {
      title: '操作',
      width: 140,
      align: 'center',
      render: () => {
        return (
          <div>
            <span
              className='href mr8'
              onClick={() => {
                APP.history.push('/fresh/merchant-accounts/checking/222')
              }}
            >
              查看明细
            </span>
            <span
              className='href'
            >
              导出
            </span>
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
                <span
                  className='download mr8'
                  onClick={() => {
                    APP.fn.download(require('@/pages/fresh/assets/批量支付模版.xlsx'), '批量支付模版')
                  }}
                >
                  下载批量支付模版
                </span>
                <span
                  className='download'
                  onClick={() => {
                    APP.fn.download(require('@/pages/fresh/assets/批量失败模版.xlsx'), '批量失败模版')
                  }}
                >
                  下载批量失败模版
                </span>
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
