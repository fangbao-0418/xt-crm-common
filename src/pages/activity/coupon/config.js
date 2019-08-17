import React from 'react';
import ActionBtnGroup from './action-btn-group/index';
import receiveStatus from '@/enum/receiveStatus';
import { Badge } from 'antd';
const badgeColors = {
  '0': 'gray',
  '1': 'blue',
  '2': 'green'
}
export const getListColumns = (setVisible) => [
  {
    title: '编号',
    dataIndex: 'couponCode',
    key: 'couponCode',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '领取时间',
    dataIndex: 'receiveTime',
    key: 'receiveTime',
  },
  {
    title: '优惠券价值',
    dataIndex: 'discountAmount',
    key: 'discountAmount',
  },
  {
    title: '已领取/总量',
    dataIndex: 'receiveRatio',
    key: 'receiveRatio',
  },
  {
    title: '已使用|使用率',
    dataIndex: 'usedRatio',
    key: 'usedRatio',
  },
  {
    title: '领取状态',
    dataIndex: 'receiveStatus',
    key: 'receiveStatus',
    render: text => <Badge color={badgeColors[text]} text={receiveStatus.getValue(text)} />
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => <ActionBtnGroup status={record.receiveStatus} setVisible={setVisible}/>
  }
]

export const pagination = {
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `共 ${total} 条记录`
}