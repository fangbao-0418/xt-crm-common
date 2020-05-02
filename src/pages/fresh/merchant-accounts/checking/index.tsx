import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { RecordProps } from './interface'
import { getFieldsConfig } from './config'
import * as api from './api'

const namespace = 'fresh/merchant-accounts/checking'

class Main extends React.Component {
  public columns: ColumnProps<RecordProps>[] = [
    { title: '对账单ID', dataIndex: 'serialNo', width: 180 },
    { title: '日期', width: 150, dataIndex: 'billDate', render: (text) => APP.fn.formatDate(text) },
    { title: '供应商ID', dataIndex: 'supplierId' },
    { title: '供应商', dataIndex: 'supplierName' },
    { title: '收入（元）', dataIndex: 'incomeMoney', align: 'center', render: (text) => APP.fn.formatMoneyNumber(text, 'm2u') },
    { title: '支出（元）', dataIndex: 'disburseMoney', align: 'center', render: (text) => APP.fn.formatMoneyNumber(text, 'm2u') },
    { title: '本期对账单金额', dataIndex: 'billMoney', align: 'center', width: 150, render: (text) => APP.fn.formatMoneyNumber(text, 'm2u') },
    { title: '状态', align: 'center', dataIndex: 'billStatusInfo' },
    {
      title: '操作',
      width: 140,
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <span
              className='href mr8'
              onClick={() => {
                APP.history.push(`/fresh/merchant-accounts/checking/${record.id}`)
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
  public batchExport () {
    const payload = this.listpage.form.getValues()
    console.log(payload)
    api.batchExport(payload).then(() => {
      APP.success('导出成功，请前往下载列表下载文件')
    })
  }
  public batchExportDetail () {
    const payload = this.listpage.form.getValues()
    api.batchExportDetail(payload).then(() => {
      APP.success('导出成功，请前往下载列表下载文件')
    })
  }
  public render () {
    return (
      <div>
        <ListPage
          reserveKey={namespace}
          columns={this.columns}
          getInstance={(ref) => {
            this.listpage = ref
          }}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.batchExport()
                }}
              >
                批量导出
              </Button>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.batchExportDetail()
                }}
              >
                批量导出明细
              </Button>
            </div>
          )}
          api={api.fetchList}
          formConfig={getFieldsConfig()}
          processPayload={(payload) => {
            const date = payload.date || []
            return {
              ...payload,
              year: date[0],
              month: date[1],
              date: undefined
            }
          }}
        />
      </div>
    )
  }
}
export default Main
