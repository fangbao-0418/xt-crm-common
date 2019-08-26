import React from 'react';
import ActionBtnGroup from './action-btn-group/index';
import receiveStatus from '@/enum/receiveStatus';
import { formatDate, formatFaceValue, formatDateRange } from '@/pages/helper';
import { Badge } from 'antd';

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
export const plainOptions = [
  { label: '安卓', value: '2' },
  { label: 'iOS', value: '4' },
  { label: 'H5', value: '8' },
  { label: '小程序', value: '16' }
]
export const useIdentityOptions = [
  { label: '普通用户', value: 0 },
  { label: '普通团长', value: 10 },
  { label: '星级团长', value: 12, disabled: true },
  { label: '体验团长', value: 11, disabled: true },
  { label: '社区管理员', value: 20 },
  { label: '城市合伙人', value: 30 },
]

export const productColumns = [{
  title: '商品ID',
  dataIndex: 'id',
  key: 'id'
}, {
  title: '商品名称',
  dataIndex: 'productName',
  key: 'productName'
}]
const calcRatio = ({ useCount, receiveCount }) => {
  const result = useCount / receiveCount;
  return (100 * result).toFixed(1) + '%';
}

export const releaseRecordsColumns = [{
  title: '编号',
  dataIndex: 'code',
  key: 'code',
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
  render: (text, record) => {

  }
}]

export const getListColumns = () => [
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
    render: (text, record) => formatDateRange(record)
  },
  {
    title: '优惠券价值',
    dataIndex: 'discountAmount',
    key: 'discountAmount',
    render: (text, record) => formatFaceValue(record)
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
    render: (text, record) => <ActionBtnGroup record={record}/>
  }
]

export const pagination = {
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `共 ${total} 条记录`
}
