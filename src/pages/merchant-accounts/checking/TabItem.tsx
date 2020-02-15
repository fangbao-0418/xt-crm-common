import React from 'react'
import { Button } from 'antd'
import { FormItem } from '@/packages/common/components/form'
import ListPage from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import { param } from '@/packages/common/utils'
import { getFieldsConfig, AccStatusEnum } from './config'
import * as api from './api'
import MonthPicker from './components/MonthPicker'
import { ColumnProps } from 'antd/lib/table'
import { GetListOnPageResponse } from './interface'
import Statements from './components/Statements'

interface Props extends Partial<AlertComponentProps> {
  /** 对账单状态 10待采购审核、20待财务审核、30审核通过、40审核不通过、50已失效 */
  status: number
}

class Main extends React.Component<Props> {
  public columns: ColumnProps<GetListOnPageResponse>[] = [
    {
      dataIndex: 'accId',
      title: '对账单ID'
    },
    {
      dataIndex: 'accName',
      title: '名称'
    },
    {
      dataIndex: 'bulidDate',
      title: '日期',
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      dataIndex: 'storeName',
      title: '供应商'
    },
    {
      dataIndex: 'incomeNum',
      title: '收入笔数'
    },
    {
      dataIndex: 'incomeMoney',
      title: '收入（元）',
      render: (text) => {
        return APP.fn.formatMoneyNumber(text, 'm2u')
      }
    },
    {
      dataIndex: 'disburseNum',
      title: '支出笔数'
    },
    {
      dataIndex: 'disburseMoney',
      title: '支出（元）',
      render: (text) => {
        return APP.fn.formatMoneyNumber(text, 'm2u')
      }
    },
    {
      dataIndex: 'settlementMoney',
      title: '本期对对账单金额',
      render: (text) => {
        return APP.fn.formatMoneyNumber(text, 'm2u')
      }
    },
    {
      dataIndex: 'accStatus',
      title: '状态',
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
  /** 添加结算单 */
  public addStatements = () => {
    if (this.props.alert) {
      this.props.alert({
        width: 600,
        title: '新建结算单',
        content: (
          <Statements />
        )
      })
    }
  }
  public componentDidMount () {
    // this.addStatements()
  }
  public render () {
    return (
      <div>
        <ListPage
          columns={this.columns}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='accId' />
              <FormItem
                label='月份'
                inner={(form) => {
                  return form.getFieldDecorator('ak47')(
                    <MonthPicker />
                  )
                }}
              />
               <FormItem name='accStatus' />
            </>
          )}
          addonAfterSearch={(
            <div>
              <Button
                className='mr10'
                type='primary'
              >
                批量导出
              </Button>
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
            return {
              ...payload,
              pageNo: payload.page,
              page: undefined
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
