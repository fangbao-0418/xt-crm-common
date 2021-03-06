import React from 'react'
import { formatMoneyWithSign } from '../../helper'
import Image from '../../../components/Image'
const shopTypeMap = {
  1: '喜团自营',
  2: '直播小店',
  3: '品牌旗舰店',
  4: '品牌专营店',
  5: '喜团工厂店',
  6: '普通企业店'
}

export const goodsColumns = (data = [], id = 'id') => {
  return [
    {
      title: '序号',
      key: 'No',
      render: (text, row, index) => {
        return index + 1
      },
      width: 60
    },
    {
      title: '商品ID',
      key: id,
      dataIndex: id,
      width: 100
    },
    {
      title: '商品名称',
      key: 'productName',
      dataIndex: 'productName',
      width: 200,
      render: (text, record) => {
        return (
          <div>
            <div>{text}</div>
            <div style={{ display: 'inline-block', backgroundColor: 'red', color: '#fff', paddingLeft: 5, paddingRight: 5, borderRadius: 2 }}>{shopTypeMap[record.shopType]}</div>
          </div>
        )
      }
    },
    {
      title: '商品主图',
      key: 'coverUrl',
      dataIndex: 'coverUrl',
      render: text => (
        <>
          <Image style={{ height: 60, width: 60 }} src={text} alt='主图' />
        </>
      )
    },
    // {
    //   title: '店铺类型',
    //   key: 'shopType',
    //   dataIndex: 'shopType',
    //   render: text => shopTypeMap[text]
    // },
    {
      title: '库存',
      key: 'stock',
      dataIndex: 'stock'
    },
    {
      title: '成本价',
      key: 'costPrice',
      dataIndex: 'costPrice',
      render: text => <>{formatMoneyWithSign(text)}</>
    },
    {
      title: '市场价',
      key: 'marketPrice',
      dataIndex: 'marketPrice',
      render: text => <>{formatMoneyWithSign(text)}</>
    },
    {
      title: '销售价',
      key: 'salePrice',
      dataIndex: 'salePrice',
      render: text => <>{formatMoneyWithSign(text)}</>
    },
    ...data
  ]
}
