import React from 'react';
import { formatMoneyWithSign } from '../../helper';
import Image from '../../../components/Image';
const commonColumns = [
  {
    title: '商品名称',
    dataIndex: 'productName',
    width: 200,
  },
  {
    title: '商品主图',
    dataIndex: 'coverUrl',
    render: text => (<>
      <Image style={{ height: 60, width: 60 }} src={text} alt="主图" />
    </>),
  },
  {
    title: '库存',
    dataIndex: 'stock',
  },
  {
    title: '成本价',
    dataIndex: 'costPrice',
    render: text => <>{formatMoneyWithSign(text)}</>,
  },
  {
    title: '市场价',
    dataIndex: 'marketPrice',
    render: text => <>{formatMoneyWithSign(text)}</>,
  },
  {
    title: '销售价',
    dataIndex: 'salePrice',
    render: text => <>{formatMoneyWithSign(text)}</>,
  }
]
export const getaActivityColumns = (data = []) => {
  return [
    {
      title: '序号',
      render: (text, row, index) => {
        return index + 1;
      },
      width: 60,
    },
    {
      title: '商品ID',
      dataIndex: 'productId',
      width: 100,
    },
    ...commonColumns,
    ...data,
  ];
};


export const goodsColumns = [
  {
    title: '序号',
    render: (text, row, index) => {
      return index + 1;
    },
    width: 60,
  },
  {
    title: '商品ID',
    dataIndex: 'id',
    width: 100,
  },
  ...commonColumns
]