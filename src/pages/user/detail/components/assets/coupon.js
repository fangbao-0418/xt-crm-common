import React, { useState, useEffect } from 'react';
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
  }
];

function coupon({ history }) {
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1
  })
  const [records, setRecords] = useState([]);
  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    const memberId = searchParams.get('memberId');
    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await getCouponList(memberId, {
          page: 1,
          pageSize: 10
        });
        setLoading(false);
        console.log('res=>', res);
        setRecords(res.records);
        setPagination({
          ...pagination,
          current: res.current,
          total: res.total
        })
      } catch(err) {
        setLoading(true);
      }
    }
    fetchList()
  }, [])
  console.log('pagination=>', pagination)
  return (
    <Card>
      <CommonTable loading={loading} rowKey="id" {...pagination} className="mt20" columns={columns} dataSource={records}/>
    </Card>
  );
}
export default coupon;