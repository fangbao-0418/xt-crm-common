import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Card, Table, Button, Input } from 'antd';
import XtSelect from '@/components/xt-select';
import axios from 'axios';
import { getListColumns, pagination } from '../config';
import receiveStatus from '@/enum/receiveStatus';
import CouponCard from '../coupon-card';
import './index.scss';

function CouponList({ form: { getFieldDecorator }, history }) {
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
  const handleOk = () => { }
  const handleAddCoupon = () => {
    history.push({pathname: '/activity/coupon/list/couponadd'})
  }
  return (
    <>
      <Modal
        title={null}
        visible={visible}
        onOk={handleOk}
        onCancel={() => {setVisible(false)}}
        footer={null}
      >
        <div className="coupon-wrapper">
          <CouponCard/>
          <div className="qr-code"></div>
          <div className="copy-qr-code">
            <Input readOnly value=""/>
            <Button className="ml10" type="primary">复制</Button>
          </div>
        </div>
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
          <Button type="primary" icon="plus" onClick={handleAddCoupon}>新增优惠券</Button>
          <Button icon="plus">批量发送记录</Button>
        </Row>
        <Table loading={loading} pagination={pagination} rowKey="couponCode" className="mt15" dataSource={data.list} columns={getListColumns(setVisible)} />
      </Card>
    </>
  )
}

export default Form.create()(CouponList);