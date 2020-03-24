import React from 'react';
import MoneyRender from '@/components/money-render'
import { Table, Row } from 'antd';
import { storeTypes } from '../constant';
import { formatMoneyWithSign } from '@/pages/helper';
import Alert from '@/packages/common/components/alert'

const BenefitInfo = (props) => {
  const {
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
    proceedsList
  } = props

  const columns = [
    {
      title: '类别',
      dataIndex: 'selfDeliveryPointType',
      width: '20%',
      render(text) {
        return storeTypes[text];
      }
    }, {
      title: '门店名称',
      width: '30%',
      dataIndex: 'selfDeliveryPointName'
    }, {
      title: '手机号',
      width: '15%',
      dataIndex: 'memberMobile'
    }, {
      title: '收益类型',
      width: '15%',
      dataIndex: 'incomeTypeDesc'
    }, {
      title: '已结算收益',
      width: '10%',
      dataIndex: 'settledAmount',
      render: MoneyRender,
    }, {
      title: '未结算收益',
      width: '10%',
      dataIndex: 'unSettledAmount',
      render: MoneyRender
    }
  ];

  return (
    <div>
      <Row>
        <span>预计盈利信息</span>
      </Row>
      <Row>成交金额：{formatMoneyWithSign(data.totalPrice)}</Row>
      <Row>成本金额：{formatMoneyWithSign(data.costPrice)}</Row>
      <Table
        columns={columns}
        dataSource={proceedsList}
        pagination={false}
      />
    </div>
  );
};

export default Alert(BenefitInfo);
