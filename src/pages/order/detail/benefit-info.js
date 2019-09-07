import React from 'react';
import MoneyRender from '@/components/money-render'
import { Table, Card, Row, Button, Modal,message } from 'antd';
import { MemberTypeTextMap } from '../constant';
import { formatMoneyWithSign } from '../../helper';
import { profitRecal, profitRecycl } from '../api';
import { formatDate } from '@/pages/helper';
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
  orderInfo,
  refresh
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
        if (incomeType == 'Rebate') return '平推奖励';
        if (incomeType == 'Spread') return '价差收益';
        if (incomeType == 'Refund') return '退款退还收益';
        return incomeType;
      },
    },
    {
      title: '收益',
      dataIndex: 'yield',
      render: MoneyRender,
    },
    {
      title: '到账时间',
      dataIndex: 'incomeTime',
      render(incomeTime){
        return formatDate(incomeTime)
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(status) {
        return status ? '已到账' : '待到账'
      },
    },
  ];

  const handleClick = function(type) {
    Modal.confirm({
      title: '系统提示',
      content: '确定要收益'+ (type == 'recycl' ? '回收' : '重跑')+'吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        (type == 'recycl' ? profitRecycl : profitRecal)({orderCode: orderInfo.orderCode}).then(res => {
          if(res.success) {
            message.success('操作成功');
            refresh();
          }
        });
      }
    });
  }
  console.log(orderInfo)
  return (
    <Card>
      <Row>预计盈利信息 <Button type="primary" style={{ float: 'right'}} onClick={()=>handleClick('recycl')}>收益回收</Button><Button type="primary" style={{ float: 'right', marginRight:'10px' }} onClick={()=>handleClick('recal')}>收益重跑</Button></Row>
      <Row>成交金额：{formatMoneyWithSign(data.totalPrice)}</Row>
      <Row>成本金额：{formatMoneyWithSign(data.costPrice)}</Row>
      <Table
        rowKey={record => record.uniqueId}
        columns={columns}
        dataSource={Array.isArray(data.memberYieldVOList) ? data.memberYieldVOList.map((v, i) => ({...v, uniqueId: i})) : []}
        pagination={false}
        defaultExpandAllRows
      />
    </Card>
  );
};

export default BenefitInfo;
