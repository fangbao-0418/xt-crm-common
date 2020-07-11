import React from 'react'
import { List } from 'antd'
import ActionView from '@/components/action-view'
import { discountsStatusMap, activeNameMap } from './config'

const formatDate = (text) =>
  text ? APP.fn.formatDate(text) : '-'

export default function getColumns ({
  onDetail, // 查看
  onEdit, // 编辑
  onCopy, // 复制
  onDisable // 关闭
}) {
  return [
    {
      title: '编号',
      width: 120,
      dataIndex: 'id'
    },
    {
      title: '活动类型',
      width: 120,
      dataIndex: 'type',
      render: text => activeNameMap[text]
    },
    {
      title: '活动名称',
      width: 120,
      dataIndex: 'title'
    },
    {
      title: '活动时间',
      width: 180,
      render: (_, record) => {
        return (
          <List
            size='small'
            dataSource={[
              {
                lab: '开始时间',
                val: formatDate(record.startTime)
              },
              {
                lab: '结束时间',
                val: formatDate(record.endTime)
              }
            ]}
            renderItem={(item) => (
              <List.Item>
                {item.lab}: {item.val}
              </List.Item>
            )}
          />
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
      title: '创建时间',
      width: 120,
      dataIndex: 'createTime',
      render: formatDate
    },
    {
      title: '更新时间',
      width: 120,
      dataIndex: 'modifyTime',
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
            {/* 只有未开始和进行中的活动支持编辑 */}
            {[1, 2].includes(record.discountsStatus) ? (
              <span
                className='href'
                onClick={onEdit.bind(null, record)}
              >
                编辑
              </span>
            ) : null}
            <span
              className='href'
              onClick={onCopy.bind(null, record)}
            >
              复制
            </span>
            {/* 未开始和进行中的活动支持关闭 */}
            {[1, 2].includes(record.discountsStatus) ? (
              <span
                onClick={onDisable.bind(null, record)}
                className='href'
              >
                关闭
              </span>
            ) : null}
          </ActionView>
        )
      }
    }
  ]
}
