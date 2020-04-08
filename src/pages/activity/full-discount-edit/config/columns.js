import React from 'react'
import ActionView from '@/components/action-view'

export const getRulesColumns = ({ onEdit, onDelete, statusDisabled }) => {
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
    },
    {
      title: '操作',
      render: (_, record, i) => {
        if (statusDisabled) return '不可操作'
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

export const getGoodsColumns = ({ onDelete, statusDisabled }) => {
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
        if (statusDisabled) return '不可操作'
        return (
          <ActionView>
            <span className="href" onClick={onDelete.bind(null, i)}>删除</span>
          </ActionView>
        )
      }
    }
  ]
}

export const getActivityColumns = ({ onDelete, statusDisabled }) => {
  return [
    {
      title: '活动ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '活动名称',
      dataIndex: 'title',
      render: (text, record) => {
        return (
          <span
            className="href"
            onClick={() => {
              APP.href(`/activity/info/edit/${record.id}?page=1&pageSize=20`, '_blank');
            }}
          >
            {text}
          </span>
        );
      }
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: text => APP.fn.formatDate(text)
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: text => APP.fn.formatDate(text)
    },
    {
      title: '活动类型',
      dataIndex: 'activityTypeName'
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      render: text => <>{text !== undefined ? (text === 0 ? '关闭' : '开启') : '-'}</>,
    },
    {
      title: '操作',
      render: (_, record, i) => {
        if (statusDisabled) return '不可操作'
        return (
          <ActionView>
            <span className="href" onClick={onDelete.bind(null, i)}>删除</span>
          </ActionView>
        )
      }
    }
  ]
}
