import React from 'react';
import ActionBtnGroup from './action-btn-group/index';
import receiveStatus from '@/enum/receiveStatus';
import { Badge } from 'antd';
import moment from 'moment';
const badgeColors = {
  '0': 'gray',
  '1': 'blue',
  '2': 'green'
}
const calcRatio = ({useCount, receiveCount}) => {
  const result = useCount / receiveCount;
  return (100 * result).toFixed(1) + '%';
}
const formatDateRange = ({startReceiveTime, overReceiveTime}) => {
  return [startReceiveTime, overReceiveTime].map(v => moment(v).format('YYYY-MM-DD HH:mm:ss')).join(' ~ ')
}
export const getListColumns = (setVisible) => [
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code',
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
    render: (text, record) => {
      return formatDateRange(record);
    }
  },
  {
    title: '优惠券价值',
    dataIndex: 'discountAmount',
    key: 'discountAmount',
    render: (text, record) => {
      switch (record.useSill) {
        // 无门槛
        case 0:
          return `无门槛${record.faceValue}`;
        // 满减
        case 1:
          const [condition, discount] = record.faceValue.split(':');
          return `满${condition}减${discount}`;
        // 折顶(打折,限制最多优惠金额))
        case 2:
          return;
        default:
          return;
      }
    }
  },
  {
    title: '已领取/总量',
    dataIndex: 'receiveRatio',
    key: 'receiveRatio',
    render: (text, record) => {
      return `${record.receiveCount}/${record.inventory}`
    }
  },
  {
    title: '已使用|使用率',
    dataIndex: 'usedRatio',
    key: 'usedRatio',
    render: (text, record) => {
      return `${record.useCount} | ${calcRatio(record)}`
    }
  },
  {
    title: '领取状态',
    dataIndex: 'status',
    key: 'status',
    render: text => <Badge color={badgeColors[text]} text={receiveStatus.getValue(text)} />
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => <ActionBtnGroup record={record} setVisible={setVisible} />
  }
]

export const pagination = {
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `共 ${total} 条记录`
}