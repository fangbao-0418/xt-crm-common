import React from 'react'
import { Button } from 'antd'
import styles from './style.module.styl'
import { FormItem } from '@/packages/common/components/form'
import ListPage from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import { parseQuery } from '@/packages/common/utils'
import { getFieldsConfig, PaymentStatusEnum, PaymentTypeEnum, AccStatusEnum, OrderPaymentStatusEnum, AfterSalePaymentStatusEnum } from './config'
import * as api from './api'
import { ColumnProps } from 'antd/lib/table'
import { GetDetailsListOnPageResponse } from './interface'
import Adjustment from '../adjustment/Detail'
import { withRouter, RouteComponentProps } from 'react-router'
import Auth from '@/components/auth'

interface Props extends Partial<AlertComponentProps>, RouteComponentProps<{id: string}> {}

interface State {
  total: number
  /** 当前页 */
  page: number
  /** 页码 */
  pageSize: number
}

class Main extends React.Component<Props, State> {
  public columns: ColumnProps<GetDetailsListOnPageResponse>[] = [
    {
      dataIndex: 'id',
      title: '序号',
      width: 80,
      align: 'center',
      render: (text, record, index) => {
        const page = this.state.page
        const pageSize = this.state.pageSize
        return (page - 1) * pageSize + index + 1
      }
    }, {
      dataIndex: 'sourceNo',
      title: '交易编号'
    }, {
      dataIndex: 'paymentType',
      title: '交易类型',
      render: (text) => {
        return PaymentTypeEnum[text]
      }
    }, {
      dataIndex: 'soucreCreateTime',
      title: '创建时间',
      render: (text) => {
        return APP.fn.formatDate(text) || ''
      }
    }, {
      dataIndex: 'finishTime',
      title: '完成时间',
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    }, {
      dataIndex: 'paymentMoney',
      title: '交易金额',
      render: (text, record) => {
        const className = [1, 3, 5].indexOf(record.paymentType) > -1 ? 'success' : 'error'
        return <span className={className}>{APP.fn.formatMoneyNumber(text, 'm2u')}</span>
      }
    }, {
      dataIndex: 'paymentStatus',
      title: '交易状态',
      render: (text, record) => {
        return [1, 3].indexOf(record.paymentType) > -1 ? OrderPaymentStatusEnum[text] : AfterSalePaymentStatusEnum[text]
      }
    }
  ]
  public query = parseQuery()
  public id = this.props.match.params.id
  public state: State = {
    total: 0,
    page: 1,
    pageSize: 10
  }
  /** 添加调整单 */
  public addAdjustment = () => {
    const query = this.query
    const record: any = {
      serialNo: query.serialNo,
      accName: query.accName
    }
    if (this.props.alert) {
      const hide = this.props.alert({
        width: 600,
        title: '新建调整单',
        content: (
          <Adjustment
            type={'add'}
            checkingInfo={record}
            onOk={() => {
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
  public render () {
    const query = this.query
    const bulidDate = APP.fn.formatDate(Number(query.bulidDate), 'YYYYMMDD')
    return (
      <div className={styles.detail}>
        <div className={styles['detail-title']}>
          {bulidDate}对账单明细
        </div>
        <div className={styles['detail-header']}>
          <div>日期：{bulidDate}</div>
          <div>状态：{AccStatusEnum[query.accStatus]}</div>
          <div>共计：{this.state.total}条</div>
        </div>
        <div className={styles['detail-header2']}>
          <div>
            <div>收入：<span className='success'>{query.incomeMoney || '0.00'}</span>元</div>
            <div>支出：<span className='error'>{query.disburseMoney || '0.00'}</span>元</div>
            <div>本期对对账单总额：
              <span className={Number(query.settlementMoney) > 0 ? 'success' : 'error'}>{query.settlementMoney || '0.00'}</span>元
            </div>
          </div>
          <div>
            <Auth code='adjustment:procurement_audit'>
              {['20', '70'].indexOf(query.accStatus) > -1 && (
                <Button
                  type='primary'
                  onClick={this.addAdjustment}
                >
                  新建调整单
                </Button>
              )}
            </Auth>
          </div>
        </div>
        <ListPage
          columns={this.columns}
          api={api.fetchDetailList}
          processPayload={(payload) => {
            this.setState({
              page: payload.page,
              pageSize: payload.pageSize
            })
            return {
              ...payload,
              accId: this.id,
              pageNo: payload.page,
              page: undefined
            }
          }}
          processData={(data) => {
            this.setState({
              total: data.total
            })
            return {
              total: data.total,
              records: data.result
            }
          }}
        />
      </div>
    )
  }
}
export default withRouter(Alert(Main))
