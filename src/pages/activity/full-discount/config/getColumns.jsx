import React from 'react'
import ActionView from '@/components/action-view'
import { discountsStatusMap } from './config'

const formatDate = (text) =>
  text ? APP.fn.formatDate(text) : '-'

export default function getColumns ({
  onDetail, // 查看
  onEdit, // 编辑
  onCopy // 复制
}) {
  return [
    {
      title: '编号',
      width: 120,
      dataIndex: 'id'
    },
    {
      title: '活动名称',
      width: 120,
      dataIndex: 'title'
    },
    {
      title: '活动时间',
      width: 120,
      render: (_, record) => {
        return (
          formatDate(record.startTime) +
          '-' +
          formatDate(record.endTime)
        )
      }
    },
    {
      title: '活动状态',
      width: 120,
      dataIndex: 'discountsStatus',
      render: (val) => discountsStatusMap[val] || '状态错误'
    },
    {
      title: '活动说明',
      width: 120,
      dataIndex: 'promotionDesc',
      render: val => val || '暂无数据'
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
      dataIndex: 'updateTime',
      render: formatDate
    },
    {
      title: '最后操作人',
      width: 120,
      dataIndex: 'operator'
    },
    {
      title: '操作',
      width: 220,
      dataIndex: 'action',
      render: (_, record) => {
        return (
          <ActionView showNum={4}>
            <span
              className='href'
              onClick={onDetail.bind(null, record)}
            >
              查看
            </span>
            <span
              className='href'
              onClick={onEdit.bind(null, record)}
            >
              编辑
            </span>
            <span
              className='href'
              onClick={onCopy.bind(null, record)}
            >
              复制
            </span>
            <span className='href'>关闭</span>
          </ActionView>
        )
      }
    }
  ]
}
