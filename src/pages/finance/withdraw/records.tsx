import React from 'react'
import { getBatchList, submitPay, batchDetail } from './api'
import { ListPage, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { formatMoneyWithSign } from '@/pages/helper'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'

/**
 * 批次记录列表
 */

type Props = AlertComponentProps

interface ItemProps {
  id: any
  /** 1=未提交 2=已提交 */
  remitStatus: 1 | 2
  /** 本批次申请时间 */
  createTime: number
  /** 提现申请结束时间 */
  endTime: number
  /** 提现申请开始时间 */
  startTime: number
  /** 本批次提现打款操作人 */
  operatorName: string
  /** 提现申请总记录数 */
  recordNum: number
  /** 提现申请总金额 */
  totalAmount: number
  /** 需充值金额 */
  totalRechargeAmount: number
}

class Records extends React.Component<Props> {
  listpage: ListPageInstanceProps
  columns = [{
    title: '提交日期',
    dataIndex: 'submitTime'
  }, {
    title: '提交状态',
    dataIndex: 'remitStatusStr'
  }, {
    title: '提交人',
    dataIndex: 'operatorName'
  }, {
    title: '申请时间',
    dataIndex: 'createTime'
  }, {
    title: '提现请求总金额',
    dataIndex: 'totalAmount',
    align: 'center',
    render: (text: any) => <>{formatMoneyWithSign(text)}</>
  }, {
    title: '需充值金额',
    dataIndex: 'totalRechargeAmount',
    align: 'center',
    render: (text: any) => <>{formatMoneyWithSign(text)}</>
  }, {
    title: '提交提现条目',
    dataIndex: 'recordNum',
    align: 'center'
  }, {
    title: '操作',
    align: 'center',
    render: (record: any) => {
      return (
        <>
          <a
            href={window.location.pathname + `#/finance/withdraw?batchId=${record.id}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            查看列表
          </a>
          {record.remitStatus === 1 && (
            <span onClick={this.applyPay(record)} className='ml8 href'>
              提交打款
            </span>
          )}
        </>
      )
    }
  }]
  applyPay = (record: ItemProps) => async () => {
    const res = await batchDetail(record.id) || {}
    // console.log(res, 'res')
    res.commonAmount = APP.fn.formatMoney(res.commonAmount)
    res.interceptAmount = APP.fn.formatMoney(res.interceptAmount)
    res.totalAmount = APP.fn.formatMoney(res.totalAmount)
    res.totalRechargeAmount = APP.fn.formatMoney(res.totalRechargeAmount)
    const hide = this.props.alert({
      title: '提交打款确认',
      content: (
        <div>
          {/* <h1 className='text-center clear font18'>提交打款确认</h1> */}
          <h2 className='text-center clear font16'>充值到连连平台后再确认打款！</h2>
          <h2 className='text-center clear font16'>本次提现需充值金额：{res.totalRechargeAmount}</h2>
          <p className='mt8'>本次提现日期范围：{res.startTime}-{res.endTime}</p>
          <p>本次提现条目数目：{res.recordNum}（普通提现{res.commonNum} 拦截提现{res.interceptNum}）</p>
          <p>本次提现金额：{res.totalAmount}（普通提现{res.commonAmount} 拦截提现{res.interceptAmount}）</p>
        </div>
      ),
      onOk: () => {
        submitPay(record.id).then(() => {
          hide()
          APP.success('已提交打款')
          this.listpage.refresh()
        })
      }
    })
  }
  getBatchList = async (data:any) => {
    if (data.create) {
      if (data.create[0]) {
        data.startTime = data.create[0].format('YYYY.MM.DD')
      }
      if (data.create[1]) {
        data.endTime = data.create[1].format('YYYY.MM.DD')
      }
      delete data.create
    }
    return await getBatchList(data)
  }

  render() {
    return (
      <ListPage
        getInstance={(ref) => this.listpage = ref}
        formItemLayout={(
          <>
            <FormItem name='create' label='申请时间' />
            <FormItem name='remitStatus' label='申请时间' />
          </>
        )}
        api={this.getBatchList}
        formConfig={{
          common: {
            create: {
              label: '申请时间',
              type: 'rangepicker'
            },
            remitStatus: {
              type: 'select',
              options: [
                {label: '未提交', value: 1},
                {label: '已提交', value: 2}
              ]
            }
          }
        }}
        columns={this.columns}
      />
    )
  }
}

export default Alert(Records)