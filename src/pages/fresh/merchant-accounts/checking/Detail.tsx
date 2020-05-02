import React from 'react'
import { Button } from 'antd'
import styles from './style.module.styl'
import DetailPage from '@/components/page/Detail'
import { FormItem } from '@/packages/common/components/form'
import ListPage from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import { parseQuery } from '@/packages/common/utils'
import * as api from './api'
import { ColumnProps } from 'antd/lib/table'
import { withRouter, RouteComponentProps } from 'react-router'
import { ShopProps } from './interface'
import Auth from '@/components/auth'

interface Props extends Partial<AlertComponentProps>, RouteComponentProps<{id: string}> {}

interface State {
  total: number
  /** 当前页 */
  page: number
  /** 页码 */
  pageSize: number
  /** 对账单数据 */
  financeAccountRecordVO: FinanceAccountRecordVO
}

interface FinanceAccountRecordVO {
  /** 创建日期 */
  billDate: number
  /** 对账单状态 */
  billStatus: number
  /** 状态描述，10：已结算 */
  billStatusInfo: string
  /** 收入 */
  incomeMoney: number
  /** 支出 */
  disburseMoney: number
  /** 总额 */
  billMoney: number
}

class Main extends React.Component<Props, State> {
  public columns: ColumnProps<ShopProps>[] = [
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
      dataIndex: 'productId',
      title: '商品ID'
    },
    {
      dataIndex: 'productName',
      title: '商品名称'
    },
    {
      dataIndex: 'skuName',
      title: '规格'
    }, {
      dataIndex: 'quantity',
      title: '数量'
    },
    {
      dataIndex: 'unitPrice',
      title: '商品单价（元）',
      render: (text) => APP.fn.formatMoneyNumber(text, 'm2u'),
      align: 'center'
    },
    {
      dataIndex: 'tradeMoney',
      title: '交易金额（元）',
      render: (text) => APP.fn.formatMoneyNumber(text, 'm2u'),
      align: 'center'
    },
    {
      dataIndex: 'recordTypeInfo',
      title: '对账类型'
    },
    {
      dataIndex: 'tradeStatusInfo',
      title: '交易状态'
    }
  ]
  public id = this.props.match.params.id
  public state: State = {
    total: 0,
    page: 1,
    pageSize: 10,
    financeAccountRecordVO: {
      billDate: 0,
      billStatus: 0,
      disburseMoney: 0,
      billStatusInfo: '',
      incomeMoney: 0,
      billMoney: 0
    }
  }
  public render () {
    const query = this.state.financeAccountRecordVO
    const bulidDate = APP.fn.formatDate(Number(query.billDate), 'YYYYMMDD')
    return (
      <DetailPage title={'对账单明细'}>
        <div className={styles.detail}>
          <div className={styles['detail-title']}>
            {bulidDate}对账单明细
          </div>
          <div className={styles['detail-header']}>
            <div>日期：{bulidDate}</div>
            <div>
              {/* 状态：{AccStatusEnum[query.accStatus]} */}
            </div>
            <div>共计：{this.state.total}条</div>
          </div>
          <div className={styles['detail-header2']}>
            <div>
              <div>收入：<span className='success'>{Number(query.incomeMoney) !== 0 ? '+' : ''}{APP.fn.formatMoney(query.incomeMoney) || '0.00'}</span>元</div>
              <div>支出：<span className='error'>{Number(query.disburseMoney) !== 0 ? '-' : ''}{APP.fn.formatMoney(query.disburseMoney) || '0.00'}</span>元</div>
              <div>本期对账单总额：
                {/* <span className={Number(query.settlementMoney) > 0 ? 'success' : 'error'}>
                  {Number(query.settlementMoney) !== 0 ? Number(query.settlementMoney) > 0 ? '+' : '-' : ''}
                  {APP.fn.formatMoney(query.settlementMoney) || '0.00'}
                </span>元 */}
              </div>
            </div>
            <div>
              <Button
                type='primary'
                // onClick={this.addAdjustment}
              >
                导出明细
              </Button>
            </div>
          </div>
          <ListPage
            columns={this.columns}
            api={api.fetchDetail}
            processPayload={(payload) => {
              this.setState({
                page: payload.page,
                pageSize: payload.pageSize
              })
              return {
                id: this.id
              }
            }}
            processData={(data) => {
              const records = data && data.accountStatementRecordDetailVOPager && data.accountStatementRecordDetailVOPager.records || []
              const total = data && data.accountStatementRecordDetailVOPager && data.accountStatementRecordDetailVOPager.total || 0
              this.setState({
                total
              })
              return {
                total,
                records
              }
            }}
          />
        </div>
      </DetailPage>
    )
  }
}
export default withRouter(Alert(Main))
