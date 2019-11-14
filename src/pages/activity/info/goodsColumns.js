import React from 'react';
import { formatMoneyWithSign } from '../../helper';
import Image from '../../../components/Image';
export const goodsColumns = (data = []) => {
  return [
    {
      title: '序号',
      key: 'No',
      render: (text, row, index) => {
        return index + 1;
      },
      width: 60,
    },
    {
      title: '商品ID',
      key: 'productId',
      dataIndex: 'productId',
      width: 100,
    },
    {
      title: '商品名称',
      key: 'productName',
      dataIndex: 'productName',
      width: 200,
    },
    {
      title: '商品主图',
      key: 'coverUrl',
      dataIndex: 'coverUrl',
      render: text => (
        <>
          <Image style={{ height: 60, width: 60 }} src={text} alt="主图" />
        </>
      ),
    },
    {
      title: '库存',
      key: 'stock',
      dataIndex: 'stock',
    },
    {
      title: '成本价',
      key: 'costPrice',
      dataIndex: 'costPrice',
      render: text => <>{formatMoneyWithSign(text)}</>,
    },
    {
      title: '市场价',
      key: 'marketPrice',
      dataIndex: 'marketPrice',
      render: text => <>{formatMoneyWithSign(text)}</>,
    },
    {
      title: '销售价',
      key: 'salePrice',
      dataIndex: 'salePrice',
      render: text => <>{formatMoneyWithSign(text)}</>,
    },
    ...data,
  ];
};
