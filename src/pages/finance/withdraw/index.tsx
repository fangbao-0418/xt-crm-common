import React from 'react';
import { ListPage } from '@/packages/common/components';
import { defaultConfig } from './config';
import { Button } from 'antd';

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
    render: (records: any) => {
      return (
        <>
          <Button>查看详情</Button>
          <Button>提交打款</Button>
          <Button>取消提现</Button>
        </>
      )
    }
  }]
  render() {
    return (
      <ListPage
        formConfig={defaultConfig}
        columns={this.columns}
        api={()=> Promise.resolve({ records: []})}
      />
    )
  }
}

export default Withdraw;