/*
 * @Date: 2019-11-27 20:55:07
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-19 14:42:16
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/activity/info/goodsColumns.js
 */
import React from 'react';
import { formatMoneyWithSign } from '@/pages/helper';
import Image from '@/components/Image';
export const goodsColumns = (data = [], id = 'id') => {
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
      key: id,
      dataIndex: id,
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
