import React from 'react';
import UserView from './components/userView';
import If from '@/packages/common/components/if'
import { formatMoney } from '@/pages/helper';
import { shopStatusMap } from './config';

const getColumns = ({ onUserClick, onClose, onOpen }) => {
  return [{
    title: '用户昵称',
    dataIndex: 'user',
    key: 'user',
    render: (val, record) => (
      <UserView
        onClick={onUserClick.bind(null, record)}
        title={record.nickName}
        desc={record.memberId}
        avatar={record.headUrl}
      />
    )
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '成交额',
    dataIndex: 'amount',
    key: 'amount',
    render: val => formatMoney(val)
  },
  {
    title: '退款金额',
    dataIndex: 'refundAmount',
    key: 'refundAmount',
    render: val => formatMoney(val)
  },
  {
    title: '用户等级',
    dataIndex: 'memberTypeDesc',
    key: 'memberTypeDesc',
  },
  {
    title: '在售商品数',
    dataIndex: 'sellPorductNum',
    key: 'sellPorductNum',
  },
  {
    title: '商品违规次数(累计|近30天)',
    dataIndex: 'violation',
    key: 'violation',
    render: (val, record) => {
      return record.illegalThirtyNum + ' | ' + record.illegalTotalNum
    }
  },
  {
    title: '状态',
    dataIndex: 'shopStatus',
    key: 'shopStatus',
    render: val => shopStatusMap[val]
  },
  {
    title: '操作',
    render: (val, record) => {
      return (
        <div>
          <If condition={record.shopStatus === 2}>
            <span onClick={onClose.bind(null, record)} className="href">关闭店铺</span>
          </If>
          <If condition={record.shopStatus === 3  || record.shopStatus === 1}>
            <span onClick={onOpen.bind(null, record)} className="href">开启店铺</span>
          </If>
        </div >
      );
    }
  }]
}

export default getColumns;