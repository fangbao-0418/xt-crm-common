import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { Card, Modal } from 'antd'
import { getCouponList, invalidCoupon } from '../../api'
import { formatRangeTime, formatFaceValue } from '@/pages/helper'
import CommonTable from '@/components/common-table'
const memberCouponStatus = {
  0: '未使用',
  1: '已使用',
  2: '已失效'
}

const { confirm } = Modal

function coupon ({ history }) {
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10
  })
  const [records, setRecords] = useState([])
  const fetchList = async (pagination) => {
    const searchParams = new URLSearchParams(history.location.search)
    const memberId = searchParams.get('memberId')
    try {
      setLoading(true)
      const res = await getCouponList(memberId, pagination)
      setLoading(false)
      setRecords(res.records)
      setPagination({
        ...pagination,
        page: res.current,
        total: res.total
      })
    } catch (err) {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchList(pagination)
  }, [])
  const columns = [
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
      title: '使用时间',
      dataIndex: 'useTime',
      key: 'useTime',
      render: (text, record) => {
        return formatRangeTime([record.startUseTime, record.overUseTime]);
      }
    },
    {
      title: '优惠券价值',
      dataIndex: 'faceValue',
      key: 'faceValue',
      render: (text, record) => formatFaceValue(record)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: text => memberCouponStatus[text]
    },
    {
      title: '是否生效',
      dataIndex: 'isDelete',
      render: text => text === 1 ? '失效' : '可用'
    },
    {
      title: '操作',
      render: (_, record) => {
        if (record.status !== 0) {
          return (
            <span style={{ color: '#ccc' }}>
              不可操作
            </span>
          )
        }
        return (
          <span
            className='href'
            onClick={() => {
              confirm({
                content: '是否失效优惠券',
                onOk () {
                  invalidCoupon(record.id).then(() => {
                    fetchList(pagination)
                  })
                }
              })
            }}
          >失效
          </span>
        )
      }
    }
  ]

  return (
    <Card>
      <CommonTable loading={loading} onChange={fetchList} rowKey="id" current={pagination.page} pageSize={pagination.pageSize} total={pagination.total} className="mt15" columns={columns} dataSource={records || []} />
    </Card>
  )
}
export default withRouter(coupon);