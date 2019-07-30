import React from 'react';
import { Table, Card } from 'antd';
import GoodCell from '../../../components/good-cell';
import MoneyRender from '../../../components/money-render';

const GoodsTable = ({ list = [] }) => {
  const columns = [
    {
      title: '商品信息',
      dataIndex: 'skuName',
      key: 'skuName',
      render(skuName, row) {
        return <GoodCell {...row} />;
      },
    },
    { title: '商品单价', dataIndex: 'salePrice', key: 'salePrice', render: MoneyRender },
    {
      title: '购买价格',
      dataIndex: 'buyPrice',
      render: MoneyRender,
    },
    {
      title: '商品数量',
      dataIndex: 'num',
      key: 'num',
    },
    {
      title: '小计',
      dataIndex: 'totalPrice',
      render: MoneyRender,
    },
  ];

  return (
    <Card>
      <Table columns={columns} dataSource={list} pagination={false} />
    </Card>
  );
};

export default GoodsTable;
