import React from 'react'
import { getBatchList } from './api'
import { ListPage, FormItem } from '@/packages/common/components'
import moment from 'moment'
import { formatMoneyWithSign } from '../../../pages/helper'
/**
 * 批次记录列表
 */
class Records extends React.Component {
  columns = [{
    title: '提交日期范围',
    dataIndex: 'submitTime'
  }, {
    title: '操作人',
    dataIndex: 'operatorName'
  }, {
    title: '申请时间',
    dataIndex: 'createTime'
  }, {
    title: '提现请求总金额',
    dataIndex: 'totalAmount',
    render: (text: any) => <>{formatMoneyWithSign(text)}</>
  }, {
    title: '提交提现条目',
    dataIndex: 'recordNum'
  }, {
    title: '操作',
    render: (records: any) => {
      return (
        <a
          href={window.location.pathname + `#/finance/withdraw?batchId=${records.id}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          查看列表
        </a>
      )
    }
  }]

  getBatchList = async (data:any) => {
    if (data.create) {
      if (data.create[0]) {
        data.startTime = data.create[0].format('YYYY-MM-DD')
      }
      if (data.create[1]) {
        data.endTime = data.create[1].format('YYYY-MM-DD')
      }
      delete data.create
    }
    return await getBatchList(data)
  }

  render () {
    return (
      <ListPage
        formItemLayout={(
          <FormItem name='create' label='申请时间'  />
        )}
        namespace={'withdraw_records'}
        api={this.getBatchList}
        formConfig={{
          withdraw_records: {
            create: {
              label: '申请时间',
              type: 'rangepicker'
            }
          }
        }}
        columns={this.columns}
      />
    )
  }
}

export default Records