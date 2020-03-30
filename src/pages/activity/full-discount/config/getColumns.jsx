import React from 'react'
import ActionView from '@/components/action-view'

const formatDate = (text) =>
  text ? APP.fn.formatDate(text) : '-'

export default function getColumns ({
  onEdit // 编辑
}) {
  return [
    {
      title: '编号',
      width: 120,
      dataIndex: 'index'
    },
    {
      title: '活动名称',
      width: 120,
      dataIndex: 'activeName'
    },
    {
      title: '活动时间',
      width: 120,
      dataIndex: 'activeTime'
    },
    {
      title: '活动状态',
      width: 120,
      dataIndex: 'activeStatus'
    },
    {
      title: '活动说明',
      width: 120,
      dataIndex: 'activeMemo'
    },
    {
      title: '创建时间',
      width: 120,
      dataIndex: 'createTime',
      render: formatDate
    },
    {
      title: '更新时间',
      width: 120,
      dataIndex: 'updateTime'
    },
    {
      title: '最后操作人',
      width: 120,
      dataIndex: 'operator'
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'action',
      render: (_, record) => {
        return (
          <ActionView showNum={4}>
            <span className='href'>查看</span>
            <span className='href' onClick={onEdit.bind(null, record)}>
              编辑
            </span>
            <span className='href'>关闭</span>
            <span className='href'>复制</span>
          </ActionView>
        )
      }
    }
  ]
}
