import React from 'react';
import { getBatchList } from './api';
import { ListPage } from '@/packages/common/components'
import { setPayload } from '@/packages/common/utils';
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
    dataIndex: 'totalAmount'
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
  render() {
    return (
      <ListPage api={getBatchList} columns={this.columns}/>
    )
  }
}

export default Records;