import React from 'react'
import ActionView from '@/components/action-view'

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
