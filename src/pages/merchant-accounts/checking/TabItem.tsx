import React from 'react'
import { Button } from 'antd'
import { FormItem } from '@/packages/common/components/form'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import { param } from '@/packages/common/utils'
import { getFieldsConfig, AccStatusEnum } from './config'
import * as api from './api'
import MonthPicker from './components/MonthPicker'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import { GetListOnPageResponse } from './interface'
import Statements from './components/Statements'
import Adjustment from '../adjustment/Detail'

interface Props extends Partial<AlertComponentProps> {
  /** 对账单状态（10：待确认；20：未结算；30：待结算；40：结算中 50:已结算 60:已结清 70:结算异常） */
  status: number
}

interface State {
  selectedRowKeys: any[]
}

class Main extends React.Component<Props, State> {
  public columns: ColumnProps<GetListOnPageResponse>[] = [
    {
      dataIndex: 'serialNo',
      title: '对账单ID',
      width: 200
    },
    {
      dataIndex: 'bulidDate',
      title: '日期',
      width: 250,
      render: (text) => {
        return APP.fn.formatDate(text) || ''
      }
    },
    // {
    //   dataIndex: 'accName',
    //   title: '名称',
    //   width: 150
    // },
    {
      dataIndex: 'storeName',
      title: '供应商',
      width: 150
    },
    {
      dataIndex: 'incomeNum',
      title: '收入笔数',
      width: 150
    },
    {
      dataIndex: 'incomeMoney',
      title: '收入（元）',
      width: 150,
      render: (text) => {
        return <span className='success'>{APP.fn.formatMoneyNumber(text, 'm2u')}</span>
      }
    },
    {
      dataIndex: 'disburseNum',
      title: '支出笔数',
      width: 150
    },
    {
      dataIndex: 'disburseMoney',
      title: '支出（元）',
      width: 150,
      render: (text) => {
        return <span className='error'>{APP.fn.formatMoneyNumber(text, 'm2u')}</span>
      }
    },
    {
      dataIndex: 'settlementMoney',
      title: '本期对对账单金额',
      width: 150,
      render: (text) => {
        const className = text > 0 ? 'success' : 'error'
        return <span>{APP.fn.formatMoneyNumber(text, 'm2u')}</span>
      }
    },
    {
      dataIndex: 'accStatus',
      title: '状态',
      width: 150,
      render: (text) => {
        return AccStatusEnum[text]
      }
    },
    {
      title: '操作',
      width: 300,
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <span
              className='href'
              onClick={() => {
                const query = param({
                  settlementMoney: APP.fn.formatMoneyNumber(record.settlementMoney, 'm2u'),
                  bulidDate: record.bulidDate,
                  incomeMoney: APP.fn.formatMoneyNumber(record.incomeMoney, 'm2u'),
                  disburseMoney: APP.fn.formatMoneyNumber(record.disburseMoney, 'm2u'),
                  serialNo: record.serialNo,
                  accName: record.accName,
                  accStatus: record.accStatus
                })
                APP.history.push(`/merchant-accounts/checking/${record.id}?${query}`)
              }}
            >
              查看明细
            </span>&nbsp;&nbsp;
            {/* <span className='href'>导出</span>&nbsp;&nbsp; */}
            {[20, 70].indexOf(record.accStatus) > -1 && <span
              className='href'
              onClick={() => {
                this.showAdjustment(record)
              }}
            >
              新建调整单
            </span>}
          </div>
        )
      }
    }
  ]
  public selectedRows: GetListOnPageResponse[] = []
  public listpage: ListPageInstanceProps
  public state: State = {
    selectedRowKeys: []
  }
  /** 添加结算单 */
  public addStatements = () => {
    if (this.selectedRows.length === 0) {
      APP.error('请选择需要结算的对账单')
      return
    }
    let notAllow = false
    /** 是否存在多个供应商 */
    const storeIds: any[] = []
    this.selectedRows.map((item) => {
      if (storeIds.indexOf(item.storeId) === -1) {
        storeIds.push(item.storeId)
      }
      if ([20, 70].indexOf(item.accStatus) === -1) {
        notAllow = true
      }
    })
    if (notAllow) {
      APP.error('存在不可结算的对账单')
      return
    }
    if (storeIds.length > 1) {
      APP.error('不能同时对多个供应商的对账单进行结算')
      return
    }
    // if (this.selectedRows.length < 7) {
    //   APP.error('对账单数量不能小于7条')
    //   return
    // }
    if (this.props.alert) {
      const hide = this.props.alert({
        width: 600,
        title: '新建结算单',
        content: (
          <Statements
            onOk={() => {
              this.listpage.refresh()
              hide()
            }}
            onCancel={() => {
              hide()
            }}
            selectedRows={this.selectedRows}
          />
        ),
        footer: null
      })
    }
  }
  /** 添加调整单 */
  public showAdjustment (record: GetListOnPageResponse) {
    if (this.props.alert) {
      const hide = this.props.alert({
        width: 600,
        title: '新建调整单',
        content: (
          <Adjustment
            type={'add'}
            checkingInfo={record}
            onOk={() => {
              this.listpage.refresh()
              hide()
            }}
            onCancel={() => {
              hide()
            }}
          />
        ),
        footer: null
      })
    }
  }
  public onSelectChange = (record: GetListOnPageResponse, selected: boolean, selectedRows: any[]) => {
    const isExist = this.selectedRows.find((item) => item.id === record.id)
    if (selected && !isExist) {
      this.selectedRows.push(record)
    } else {
      if (isExist) {
        this.selectedRows = this.selectedRows.filter((item) => {
          return item.id !== record.id
        })
      }
    }
  }
  public getUniqSelectedRow (rows: GetListOnPageResponse[]) {
    const result: GetListOnPageResponse[] = []
    const temp: any = {}
    rows.map(item => {
      if (temp[item.id] === undefined) {
        result.push(item)
        temp[item.id] = true
      }
    })
    return result
  }
  public onSelectAll = (selected: boolean, selectedRows: GetListOnPageResponse[], changeRows: GetListOnPageResponse[]) => {
    if (selected) {
      this.selectedRows = this.selectedRows.concat(changeRows)
      this.selectedRows = this.getUniqSelectedRow(this.selectedRows)
    } else {
      this.selectedRows = this.selectedRows.filter((item) => {
        return changeRows.findIndex((item2) => {
          return item2.id === item.id
        }) === -1
      })
    }
  }
  public render () {
    const rowSelection: TableRowSelection<GetListOnPageResponse> = {
      // selectedRowKeys,
      fixed: true,
      columnWidth: 50,
      onSelect: this.onSelectChange,
      onSelectAll: this.onSelectAll
    }
    return (
      <div>
        <ListPage
          reserveKey={`checking${this.props.status}`}
          columns={this.columns}
          formConfig={getFieldsConfig()}
          getInstance={(ref) => {
            this.listpage = ref
          }}
          mounted={() => {
            if (this.listpage.cachePayload) {
              const { bulidYear, bulidMonth } = this.listpage.cachePayload
              if (bulidYear !== undefined) {
                const date = [bulidYear]
                if (bulidMonth !== undefined) {
                  date.push(bulidMonth)
                }
                this.listpage.form.setValues({
                  date
                })
              }
            }
          }}
          formItemLayout={(
            <>
              <FormItem name='serialNo' />
              <FormItem name='storeName' />
              <FormItem
                label='月份'
                inner={(form) => {
                  const now = new Date()
                  const initData = [now.getFullYear(), now.getMonth() + 1]
                  return form.getFieldDecorator('date', {
                    initialValue: initData
                  })(
                    <MonthPicker />
                  )
                }}
              />
            </>
          )}
          tableProps={{
            rowKey: 'serialNo',
            scroll: {
              x: this.columns.map((item) => Number(item.width || 0)).reduce((a, b) => {
                return a + b
              })
            },
            rowSelection
          }}
          addonAfterSearch={(
            <div>
              {/* <Button
                className='mr10'
                type='primary'
              >
                批量导出
              </Button>
              <Button
                className='mr10'
                type='primary'
              >
                全部导出
              </Button> */}
              {[20, 70].indexOf(this.props.status) > -1 && (
                <Button
                  type='primary'
                  onClick={this.addStatements}
                >
                  生成结算单
                </Button>
              )}
            </div>
          )}
          api={api.fetchList}
          processPayload={(payload) => {
            const status = this.props.status
            const date = payload.date || []
            return {
              ...payload,
              pageNo: payload.page,
              page: undefined,
              bulidYear: date[0],
              bulidMonth: date[1],
              date: undefined,
              accStatus: status === -1 ? undefined : status
            }
          }}
          processData={(data) => {
            return {
              records: data.result,
              total: data.total
            }
          }}
        />
      </div>
    )
  }
}
export default Alert(Main)
