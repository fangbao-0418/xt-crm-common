import React from 'react'
import DateFns from 'date-fns'
import activityType from '@/enum/activityType'

export const getRulesColumns = () => {
  return [
    {
      title: '级数',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, i) => {
        return `第 ${i + 1} 级`
      }
    },
    {
      title: '优惠门槛',
      dataIndex: 'conditionStr',
      key: 'conditionStr'
    },
    {
      title: '优惠方式',
      dataIndex: 'modeStr',
      key: 'modeStr'
    }
  ]
}

export const getGoodsColumns = () => {
  return [
    {
      title: '商品ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName'
    }
  ]
}

export const getActivityColumns = () => {
  return [
    {
      title: '活动ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '活动名称',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: text => <span>{text ? DateFns.format(text, 'YYYY-MM-DD HH:mm:ss') : '-'}</span>
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: text => <span>{text ? DateFns.format(text, 'YYYY-MM-DD HH:mm:ss') : '-'}</span>
    },
    {
      title: '活动类型',
      dataIndex: 'type',
      render: text => (
        <span>
          {text ? activityType.getValue(text) : '-'}
        </span>
      )
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      render: text => <>{text !== undefined ? (text === 0 ? '关闭' : '开启') : '-'}</>,
    }
  ]
}
