import React, { useState } from 'react';
import { Form, Row, Card, Table, Button, Input } from 'antd';
import XtSelect from '@/components/xt-select';
const columns = [
  {
    title: '编号',
    dataIndex: 'couponCode',
    key: 'couponCode',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '领取时间',
    dataIndex: 'receiveTime',
    key: 'receiveTime',
  },
  {
    title: '优惠券价值',
    dataIndex: 'discountAmount',
    key: 'discountAmount',
  },
  {
    title: '已领取/总量',
    dataIndex: 'receiveRatio',
    key: 'receiveRatio',
  },
  {
    title: '已使用|使用率',
    dataIndex: 'usedRatio',
    key: 'usedRatio',
  },
  {
    title: '领取状态',
    dataIndex: 'receiveStatus',
    key: 'receiveStatus',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  }
]


function CouponList({ form: { getFieldDecorator } }) {
  console.log('getFieldDecorator=>', getFieldDecorator)
  const [list, setList] = useState([])
  return (
    <>
      <Card>
        <Form layout="inline">
          <Form.Item label="优惠券编号">
            {getFieldDecorator('couponCode', {})(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="状态">
            {getFieldDecorator('couponCode', {})(<XtSelect style={{ width: '174px' }} placeholder="请输入" />)}
          </Form.Item>
          <Form.Item>
            <Button>查询</Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Row type="flex" justify="space-between">
          <Button type="primary" icon="plus">新增优惠券</Button>
          <Button icon="plus">批量发送记录</Button>
        </Row>
        <Table className="mt15" dataSource={list} columns={columns} />
      </Card>
    </>
  )
}

export default Form.create()(CouponList);