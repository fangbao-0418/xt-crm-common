import React from 'react';
import Image from '@/components/Image';
import { If } from '@/packages/common/components';
import { replaceHttpUrl } from '@/util/utils';
import { formatMoneyWithSign } from '@/pages/helper';

const getColumns = ({ status, onPreview, onViolation, onDetail, onLower, onPass, onUnpass }) => {
  return [
    {
      title: '商品ID',
      width: 120,
      dataIndex: 'id'
    },
    {
      title: '商品主图',
      dataIndex: 'coverUrl',
      width: 120,
      render: (val, record) => (
        <Image
          style={{
            height: 100,
            width: 100,
            minWidth: 100
          }}
          src={replaceHttpUrl(val)}
          onClick={() => onPreview(record)}
          alt='主图'
        />
      )
    },
    {
      title: '商品标题',
      width: 120,
      dataIndex: 'productName'
    },
    {
      title: '一级类目',
      width: 120,
      dataIndex: 'categoryName'
    },
    {
      title: '售价',
      width: 100,
      dataIndex: 'salePrice',
      render: formatMoneyWithSign
    },
    {
      title: '供应商',
      width: 100,
      dataIndex: 'stock'
    },
    {
      title: '商品状态',
      width: 100,
      dataIndex: 'saleCount'
    },
    {
      title: '审核时间',
      width: 120,
      dataIndex: 'storeName'
    },
    {
      title: '违规次数',
      dataIndex: 'modifyTime',
      width: 200,
      render: (val, record) => (
        <span onClick={() => onViolation(record)} className="href">{val}</span>
      )
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 200,
      render: (record) => {
        return (
          <div style={{ marginTop: 40 }}>
            <span
              className='href'
              onClick={() => onDetail(record)}
            >
              查看
            </span>
            <If condition={status === 0}>
              <span
                className='href ml10'
                onClick={() => onPass(record)}
              >
                通过
              </span>
            </If>
            <If condition={status === 0}>
              <span
                className='href ml10'
                onClick={() => onUnpass(record)}
              >
                不通过
              </span>
            </If>
            <If condition={status === 0}>
              <span
                className='href ml10'
                onClick={() => onLower(record)}
              >
                下架
              </span>
            </If>
          </div>
        )
      }
    }
  ]
}

export default getColumns