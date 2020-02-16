import React from 'react'
import { Button } from 'antd'
import { FormItem } from '@/packages/common/components/form'
import ListPage from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import { param } from '@/packages/common/utils'
import { getFieldsConfig, AccStatusEnum } from './config'
import * as api from './api'
import MonthPicker from './components/MonthPicker'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import { GetListOnPageResponse } from './interface'
import Statements from './components/Statements'

interface Props extends Partial<AlertComponentProps> {
  /** 对账单状态 10待采购审核、20待财务审核、30审核通过、40审核不通过、50已失效 */
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
        return APP.fn.formatDate(text)
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
        return APP.fn.formatMoneyNumber(text, 'm2u')
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
                  disburseMoney: APP.fn.formatMoneyNumber(record.disburseMoney, 'm2u')
                })
                APP.history.push(`/merchant-accounts/checking/${record.id}?${query}`)
              }}
            >
              查看明细
            </span>&nbsp;&nbsp;
            <span className='href'>导出</span>&nbsp;&nbsp;
            <span className='href'>新建调整单</span>
          </div>
        )
      }
    }
  ]
  public selectedRows: GetListOnPageResponse[] = []
  public state: State = {
    selectedRowKeys: []
  }
  /** 添加结算单 */
  public addStatements = () => {
    if (this.selectedRows.length === 0) {
      APP.error('请选择需要结算的对账单')
      return
    }
    if (this.props.alert) {
      this.props.alert({
        width: 600,
        title: '新建结算单',
        content: (
          <Statements
            selectedRows={this.selectedRows}
          />
        ),
        footer: null
      })
    }
  }
  public componentDidMount () {
    // this.addStatements()
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
    const { selectedRowKeys } = this.state;
    const rowSelection: TableRowSelection<GetListOnPageResponse> = {
      // selectedRowKeys,
      columnWidth: 50,
      onSelect: this.onSelectChange,
      onSelectAll: this.onSelectAll
    }
    return (
      <div>
        <ListPage
          columns={this.columns}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='serialNo' />
              <FormItem name='storeName' />
              <FormItem
                label='月份'
                inner={(form) => {
                  return form.getFieldDecorator('date')(
                    <MonthPicker />
                  )
                }}
              />
            </>
          )}
          tableProps={{
            rowKey: 'serialNo',
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
              <Button
                type='primary'
                onClick={this.addStatements}
              >
                生成结算单
              </Button>
            </div>
          )}
          api={api.fetchList}
          processPayload={(payload) => {
            const status = this.props.status
            const now = new Date()
            const date = payload.date || []
            payload.pageSize = 3
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
