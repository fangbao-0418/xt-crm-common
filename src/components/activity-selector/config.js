import React from 'react'
import activityType from '@/enum/activityType'
import DateFns from 'date-fns'
export const actColumns = (data = []) => {
  return [
    {
      title: '活动ID',
      dataIndex: 'id',
      width: 100
    },
    {
      title: '活动名称',
      dataIndex: 'title',
      render: text => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>
        )
      }
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: text => <>{text ? DateFns.format(text, 'YYYY-MM-DD HH:mm:ss') : '-'}</>
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: text => <>{text ? DateFns.format(text, 'YYYY-MM-DD HH:mm:ss') : '-'}</>
    },
    {
      title: '活动类型',
      dataIndex: 'type',
      render: text => (
        <>
          {text ? activityType.getValue(text) : '-'}
        </>
      )
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      render: text => <>{text !== undefined ? (text === 0 ? '关闭' : '开启') : '-'}</>
    }
  ]
}