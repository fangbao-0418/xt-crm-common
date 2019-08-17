import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Card, Table, Button, Input } from 'antd';
import XtSelect from '@/components/xt-select';
import axios from 'axios';
import { columns, pagination } from '../config';
import receiveStatus from '@/enum/receiveStatus';
import './index.scss';
function CouponList({ form: { getFieldDecorator } }) {
  const [data, setData] = useState({ list: [] });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await axios('/api/coupon/list');
      setLoading(false);
      setData(result.data.data);
    }
    fetchData();
  }, []);
  const handleOk = () => {}
  const handleCancel = () => {}
  return (
    <>
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        
      </Modal>
      <Card>
        <Form layout="inline">
          <Form.Item label="优惠券编号">
            {getFieldDecorator('couponCode', {})(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="优惠券名称">
            {getFieldDecorator('name', {})(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="状态">
            {getFieldDecorator('receiveStatus', {})(<XtSelect data={receiveStatus.getArray()} style={{ width: '174px' }} placeholder="请输入" />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary">查询</Button>
            <Button className="ml10">重置</Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Row type="flex" justify="space-between">
          <Button type="primary" icon="plus">新增优惠券</Button>
          <Button icon="plus">批量发送记录</Button>
        </Row>
        <Table loading={loading} pagination={pagination} rowKey="couponCode" className="mt15" dataSource={data.list} columns={columns} />
      </Card>
    </>
  )
}

export default Form.create()(CouponList);