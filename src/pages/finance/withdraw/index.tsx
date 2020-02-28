import React from 'react';
import { ListPage } from '@/packages/common/components';
import { getRemittanceList } from './api';
import { defaultConfig } from './config';
import { Button } from 'antd';
import { getPayload } from '@/packages/common/utils';

export const RESERVE_KEY = 'withdraw';
/**
 * 提现管理列表
 */
class Withdraw extends React.Component {
  columns = [{
    title: '提现单号',
    dataIndex: 'transferNo'
  }, {
    title: '提现类型',
    dataIndex: 'moneyAccountType'
  }, {
    title: '申请人账号',
    dataIndex: 'memberMobile'
  }, {
    title: '申请时间',
    dataIndex: 'createTime'
  }, {
    title: '提交时间',
    dataIndex: 'submitTime'
  }, {
    title: '提现金额',
    dataIndex: 'transferAmount'
  }, {
    title: '服务费',
    dataIndex: 'serviceCharge'
  }, {
    title: '银行卡绑定人',
    dataIndex: 'realName'
  }, {
    title: '银行卡号',
    dataIndex: 'bankCardNo'
  }, {
    title: '身份证号',
    dataIndex: 'idCardNo'
  }, {
    title: '提现状态'
  }, {
    title: '操作',
    width: 220,
    fixed: 'right',
    render: (records: any) => {
      return (
        <>
          <span className='href'>查看详情</span>
          <span className='href ml10'>提交打款</span>
          <span className='href ml10'>取消提现</span>
        </>
      )
    }
  }]
  render() {
    return (
      <ListPage
        tableProps={{
          scroll: {
            x: true
          }
        }}
        reserveKey={RESERVE_KEY}
        getInstance={(ref) => {
          console.log(`${RESERVE_KEY} =>`, getPayload(RESERVE_KEY));
          ref.form && ref.form.setValues(getPayload(RESERVE_KEY));
        }}
        addonAfterSearch={(
          <>
            <Button type='primary' onClick={() => APP.history.push('/finance/withdraw/records')}>批次记录</Button>
            <Button type='primary' className='ml10'>按申请日期提交打款</Button>
            <Button type='primary' className='ml10'>导出表格</Button>
          </>
        )}
        formConfig={defaultConfig}
        columns={this.columns}
        api={getRemittanceList}
      />
    )
  }
}

export default Withdraw;