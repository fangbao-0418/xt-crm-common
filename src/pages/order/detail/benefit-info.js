import React from 'react';
import { Table, Card } from 'antd';
import { MemberTypeTextMap } from '../constant';
import MoneyRender from '@/components/money-render'
// import { formatMoneyWithSign } from '../../helper';

const BenefitInfo = ({
  data = {
    costPrice: 0,
    memberYieldVOList: [
      {
        memberType: 0,
        userName: 'string',
        yield: 0,
      },
    ],
    totalPrice: 0,
  },
}) => {
  const columns = [
    {
      title: '类别',
      dataIndex: 'memberType',
      render(memberType) {
        return MemberTypeTextMap[memberType];
      },
    },
    { title: '姓名', dataIndex: 'userName' },
    {
      title: '收益类型', dataIndex: 'incomeType',
      render(incomeType) {
        // Rebate 平推奖励 +  Spread +  Refund 退款退还收益       
        if(incomeType == 'Rebate') return '平推奖励';
        if(incomeType == 'Spread') return '价差收益';
        if(incomeType == 'Refund') return '退款退还收益';
        return incomeType;
      },
    },
    {
      title: '收益',
      dataIndex: 'yield',
      render: MoneyRender,
    },
  ];

  return (
    <Card title="预估收益">
      {/* <Row>成交金额：{formatMoneyWithSign(data.totalPrice)}</Row>
      <Row>成本金额：{formatMoneyWithSign(data.costPrice)}</Row> */}
      <Table
        columns={columns}
        dataSource={data.memberYieldVOList}
        pagination={false}
        defaultExpandAllRows
      />
    </Card>
  );
};

export default BenefitInfo;
