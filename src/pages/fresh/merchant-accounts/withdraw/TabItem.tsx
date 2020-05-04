import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import If from '@/packages/common/components/if'
import { Button, Input, Popconfirm } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { RecordProps } from './interface'
import { getFieldsConfig, PayTypeEnum, StatusEnum } from './config'
import * as api from './api'

export const namespace = 'fresh/merchant-accounts/withdraw'

interface Props extends Partial<AlertComponentProps> {
  /** 提现状态（0-全部，5-待提现，15-提现成功，25-提现失败） */
  status: 0 | 5 | 15 | 25
}

class Main extends React.Component<Props> {
  public columns: ColumnProps<RecordProps>[] = [
    { title: '申请单编号', dataIndex: 'code', width: 200 },
    { title: '金额', dataIndex: 'cashOutMoney', width: 150, render: (text) => APP.fn.formatMoneyNumber(text, 'm2u') },
    { title: '供应商ID', dataIndex: 'supplierUid', width: 150 },
    { title: '供应商名称', dataIndex: 'supplierName', width: 150 },
    { title: '提现方式', dataIndex: 'payType', width: 150, render: (text) => PayTypeEnum[text] },
    {
      title: '提现账户',
      dataIndex: 'accountName',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return (
          <div>
            <div>{record.accountName}</div>
            <div>{record.accountNo}</div>
            <div>{record.bankBranchName}</div>
          </div>
        )
      }
    },
    { title: '状态', dataIndex: 'status', width: 100, render: (text) => StatusEnum[text] },
    { title: '申请时间', dataIndex: 'createTime', width: 150, render: (text) => APP.fn.formatDate(text) },
    { title: '操作人', dataIndex: 'operator', width: 100 },
    { title: '操作时间', dataIndex: 'operateTime', width: 150, render: (text) => APP.fn.formatDate(text) },
    {
      title: '操作',
      width: 140,
      fixed: 'right',
      align: 'center',
      render: (text, record) => {
        return (
          <If condition={record.status === 5}>
            <Popconfirm
              title='确定是否提现成功？'
              onConfirm={this.toOperate(record, 15)}
            >
              <Button
                type='primary'
                size='small'
                className='mb8'
              >
                提现成功
              </Button>
            </Popconfirm>
            <Button
              size='small'
              onClick={this.toOperate(record, 25)}
            >
              提现失败
            </Button>
          </If>
        )
      }
    }
  ]
  public listpage: ListPageInstanceProps
  /**
   * 单条提现操作 type 15-提现成功，25-提现失败
   */
  public toOperate = (record: RecordProps, type: 15 | 25) => () => {
    if (type === 25) {
      if (this.props.alert) {
        let operateRemark = ''
        const hide = this.props.alert({
          title: '提现失败',
          content: (
            <div>
              <Input.TextArea
                placeholder='请输入提现失败原因'
                onChange={(e) => {
                  const value = e.target.value
                  operateRemark = value
                }}
              />
            </div>
          ),
          onOk: () => {
            api.toOperate({
              supplierCashOutId: record.supplierCashOutId,
              status: type,
              operateRemark
            }).then(() => {
              hide()
              this.listpage.refresh()
            })
          }
        })
      }
    } else {
      api.toOperate({
        supplierCashOutId: record.supplierCashOutId,
        status: type,
        operateRemark: ''
      }).then(() => {
        this.listpage.refresh()
      })
    }
  }
  public batchExport () {
    const payload = this.listpage.form.getValues()
    api.batchExport(payload).then(() => {
      APP.success('导出成功，请前去下载列表下载文件')
    })
  }
  public batchPay () {
    this.selectFile().then((file) => {
      api.batchPay(file).then(() => {
        APP.success('批量成功操作完成')
        this.listpage.refresh()
      })
    })
  }
  public batchPayFail () {
    this.selectFile().then((file) => {
      api.batchPayFail(file).then(() => {
        APP.success('批量失败操作完成')
        this.listpage.refresh()
      })
    })
  }
  public selectFile () {
    return new Promise<File>((resolve) => {
      const el = document.createElement('input')
      el.setAttribute('type', 'file')
      el.onchange = function () {
        if (el) {
          const file = el.files && el.files[0]
          if (file) {
            resolve(file)
          }
        }
      }
      el.click()
    })
  }
  public render () {
    return (
      <div>
        <ListPage
          reserveKey={namespace}
          columns={this.columns}
          showButton={false}
          getInstance={(ref) => {
            this.listpage = ref
          }}
          rangeMap={{
            operateTime: {
              fields: ['operateTimeStart', 'operateTimeEnd']
            },
            createTime: {
              fields: ['createTimeStart', 'createTimeEnd']
            }
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
                  this.batchPay()
                }}
              >
                批量支付
              </Button>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.batchPayFail()
                }}
              >
                批量失败
              </Button>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.batchExport()
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
          api={api.fetchList}
          formConfig={getFieldsConfig()}
          processPayload={(payload) => {
            const status = this.props.status === 0 ? undefined : this.props.status
            payload.status = status
            console.log(payload, 'payload')
            return {
              ...payload,
              status
            }
          }}
          tableProps={{
            scroll: {
              x: this.columns.map((item) => Number(item.width || 0)).reduce((a, b) => {
                return a + b
              })
            }
          }}
        />
      </div>
    )
  }
}
export default Alert(Main)
