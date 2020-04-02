import React from 'react'
import ActionView from '@/components/action-view'
import activityType from '@/enum/activityType'
import DateFns from 'date-fns'

export const getRulesColumns = ({ onEdit, onDelete }) => {
  return [
    {
      title: '优惠门槛',
      dataIndex: 'conditionStr',
      key: 'conditionStr'
    },
    {
      title: '优惠方式',
      dataIndex: 'modeStr',
      key: 'modeStr'
    },
    {
      title: '操作',
      render: (_, record, i) => {
        return (
          <ActionView>
            <span className="href" onClick={onEdit.bind(null, i)}>编辑</span>
            <span className="href" onClick={onDelete.bind(null, i)}>删除</span>
          </ActionView>
        )
      }
    }
  ]
}

export const getGoodsColumns = ({ onDelete }) => {
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
    },
    {
      title: '操作',
      render: (_, record, i) => {
        return (
          <ActionView>
            <span className="href" onClick={onDelete.bind(null, i)}>删除</span>
          </ActionView>
        )
      }
    }
  ]
}

export const getActivityColumns = ({ onDelete }) => {
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
    },
    {
      title: '操作',
      render: (_, record, i) => {
        return (
          <ActionView>
            <span className="href" onClick={onDelete.bind(null, i)}>删除</span>
          </ActionView>
        )
      }
    }
  ]
}
