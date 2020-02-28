import React from 'react';
import { getBatchList } from './api';
import { ListPage } from '@/packages/common/components'
import { setPayload } from '@/packages/common/utils';
import { RESERVE_KEY } from '.';
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
        <span
          className='href'
          onClick={() => {
            setPayload(RESERVE_KEY, records);
            APP.history.push('/finance/withdraw');
          }}
        >
          查看列表
        </span>
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