import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router'
import { Card } from 'antd';
import { getCouponList } from '../../api';
import { formatRangeTime, formatFaceValue } from '@/pages/helper';
import CommonTable from '@/components/common-table';
const memberCouponStatus = {
  0: '未使用',
  1: '已使用',
  2: '已失效'
}
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
  }
];

function coupon({ history }) {
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10
  })
  const [records, setRecords] = useState([]);
  const fetchList = async (pagination) => {
    const searchParams = new URLSearchParams(history.location.search);
    const memberId = searchParams.get('memberId');
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
      setLoading(true);
    }
  }
  useEffect(() => {
    fetchList(pagination)
  }, [])
  return (
    <Card>
      <CommonTable loading={loading} onChange={fetchList} rowKey="id" current={pagination.page} pageSize={pagination.pageSize} total={pagination.total} className="mt15" columns={columns} dataSource={records || []} />
    </Card>
  );
}
export default withRouter(coupon);