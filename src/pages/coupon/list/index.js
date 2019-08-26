import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Card, Table, Button, Input } from 'antd';
import XtSelect from '@/components/xt-select';
import { getCouponlist } from '../api';
import { getListColumns, pagination } from '../config';
import receiveStatus from '@/enum/receiveStatus';
import CouponCard from '../coupon-card';
import './index.scss';

function CouponList({ form: { getFieldDecorator, getFieldsValue, resetFields }, history, match }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false)
  const fetchData = async (data = {}) => {
    try {
      setLoading(true);
      const res = await getCouponlist(data);
      setLoading(false);
      setRecords(res.records);
    } catch (err) {
      setLoading(false);
    }
  }
  useEffect(() => { 
    fetchData();
  }, []);
  const handleOk = () => { }
  const handleAddCoupon = () => {
    history.push({
      pathname: `${match.url}/couponinfo`,
      search: `type=add`
    })
  }
  const handleSearch = () => {
    const data = getFieldsValue()
    fetchData(data)
  }
  return (
    <>
      <Modal
        title={null}
        visible={visible}
        onOk={handleOk}
        onCancel={() => { setVisible(false) }}
        footer={null}
      >
        <div className="coupon-wrapper">
          <CouponCard />
          <div className="qr-code"></div>
          <div className="copy-qr-code">
            <Input readOnly value="" />
            <Button className="ml10" type="primary">复制</Button>
          </div>
        </div>
      </Modal>
      <Card>
        <Form layout="inline">
          <Form.Item label="优惠券编号">
            {getFieldDecorator('code', {})(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="优惠券名称">
            {getFieldDecorator('name', {})(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="状态">
            {getFieldDecorator('status', {})(<XtSelect data={receiveStatus.getArray()} style={{ width: '174px' }} placeholder="请输入" />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button className="ml10" onClick={() => resetFields()}>重置</Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Row type="flex" justify="space-between">
          <Button type="primary" icon="plus" onClick={handleAddCoupon}>新增优惠券</Button>
          {/* <Button icon="plus">批量发送记录</Button> */}
        </Row>
        <Table rowKey="id" loading={loading} pagination={pagination} className="mt15" dataSource={records} columns={getListColumns(setVisible)} />
      </Card>
    </>
  )
}

export default Form.create()(CouponList);