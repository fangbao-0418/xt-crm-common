import React from 'react';
import { ListPage } from '@/packages/common/components';
import { defaultConfig } from './config';
import { Button } from 'antd';

class Withdraw extends React.Component {
  columns = [{
    title: '提现单号'
  }, {
    title: '提现类型'
  }, {
    title: '申请人账号'
  }, {
    title: '申请时间'
  }, {
    title: '提交时间'
  }, {
    title: '提现金额'
  }, {
    title: '服务费'
  }, {
    title: '银行卡绑定人'
  }, {
    title: '银行卡号'
  }, {
    title: '身份证号'
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