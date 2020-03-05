import React from 'react';
import { Divider } from 'antd';

const getColumns = ({ onDetail, onSwitch }) => {
  return [{
    title: '用户昵称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '成交额',
    dataIndex: 'volume',
    key: 'volume',
  },
  {
    title: '退款金额',
    dataIndex: 'refund',
    key: 'refund',
  },
  {
    title: '用户等级',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: '在售商品数',
    dataIndex: 'saleCount',
    key: 'saleCount',
  },
  {
    title: '商品违规次数(累计|近30天)',
    dataIndex: 'violation',
    key: 'violation',
  },
  {
    title: '操作',
    render: (val, record) => {
      return (
        <div>
          <span onClick={onDetail.bind(null, record.id)} className="href">查看详情</span>
          <Divider type="vertical" />
          <span onClick={onSwitch.bind(null, record)} className="href">关闭店铺</span>
        </div>
      );
    }
  }]
}

export default getColumns;