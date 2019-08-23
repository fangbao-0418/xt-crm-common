import React from 'react';
import ActionBtnGroup from './action-btn-group/index';
import receiveStatus from '@/enum/receiveStatus';
import { formatDate } from '@/pages/helper';
import { Badge } from 'antd';
import moment from 'moment';
const listBadgeColors = {
  '0': 'gray',
  '1': 'blue',
  '2': 'green'
}
const releaseRecordsBadgeColors = {
  '0': 'gray',
  '1': 'blue',
  '2': 'green',
  '3': 'orange',
  '4': 'red'
}
export const userType = {
  '0': '全部',
  '1': '用户等级',
  '2': '指定用户',
  '3': '文件'
}
export const taskStatus = {
  '0': '未执行',
  '1': '执行中',
  '2': '已执行',
  '3': '停止',
  '4': '失败'
}
const calcRatio = ({ useCount, receiveCount }) => {
  const result = useCount / receiveCount;
  return (100 * result).toFixed(1) + '%';
}
const formatDateRange = ({ startReceiveTime, overReceiveTime }) => {
  return [startReceiveTime, overReceiveTime].map(v => moment(v).format('YYYY-MM-DD HH:mm:ss')).join(' ~ ')
}
export const releaseRecordsColumns = [{
  title: '编号',
  dataIndex: 'code',
  key: 'couponCode',
}, {
  title: '优惠券名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '目标用户',
  dataIndex: 'receiveUserGroup',
  key: 'receiveUserGroup',
  render: (text, record) => userType[text]
}, {
  title: '发送时间',
  dataIndex: 'executionTime',
  key: 'executionTime',
  render: (text) => formatDate(text)
}, {
  title: '领取状态',
  dataIndex: 'status',
  key: 'status',
  render: (text) => {
    return <Badge color={releaseRecordsBadgeColors[text]} text={taskStatus[text]} />
  }
}, {
  title: '操作',
  dataIndex: 'action',
  key: 'action',
  render: () => {

  }
}]
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
      let result = [];
      console.log(record.faceValue + '--------')
      switch (record.useSill) {
        // 无门槛
        case 0:
          return `无门槛${record.faceValue}`;
        // 满减
        case 1:
          result = record.faceValue.split(':');
          return `满${result[0]}减${result[1]}`;
        // 折顶(打折,限制最多优惠金额))
        case 2:
          return;
        default:
          result = record.faceValue.split(':');
          return `满${result[0]}减${result[1]}`;
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
      return record.receiveCount ? `${record.useCount} | ${calcRatio(record)}` : '-'
    }
  },
  {
    title: '领取状态',
    dataIndex: 'status',
    key: 'status',
    render: text => <Badge color={listBadgeColors[text]} text={receiveStatus.getValue(text)} />
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