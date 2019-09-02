import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Card, Button, Input } from 'antd';
import {XtSelect, CommonTable} from '@/components';
import { getCouponlist, getCouponDetail } from '../api';
import { getListColumns } from '../config';
import receiveStatus from '@/enum/receiveStatus';
import emitter from '@/util/events';
import ClipboardJS from "clipboard";
import CouponCard from '../coupon-card';
import QRCode from 'qrcode.react';
import { h5Host } from '@/util/baseHost';
import './index.scss';

function CouponList({ form: { getFieldDecorator, getFieldsValue, resetFields }, history, match }) {
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10
  })
  const [records, setRecords] = useState([]);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false)
  const fetchData = async (data = {}) => {
    console.log('data=>', data);
    try {
      setLoading(true);
      const res = await getCouponlist({
        ...pagination,
        ...data
      });
      console.log('res=>', res);
      setLoading(false);
      setRecords(res.records);
      setPagination({
        ...pagination,
        page: res.current,
        total: res.total
      })
    } catch (err) {
      setLoading(false);
    }
  }
  const setModalVisible = async ({ visible, id }) => {
    const info = await getCouponDetail(id);
    setInfo(info);
    setVisible(visible)
  }
  useEffect(() => {
    console.log('pagination变了=>', pagination.page, pagination.pageSize)
    new ClipboardJS('#copy-btn');
    fetchData();
    emitter.addListener('coupon.list.setVisible', setModalVisible)
    emitter.addListener('coupon.list.fetchData', fetchData)
    return () => {
      emitter.removeListener('coupon.list.setVisible', setModalVisible);
      emitter.removeListener('coupon.list.fetchData', fetchData);
    }
  }, [pagination.page, pagination.pageSize]);
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
  const handleChangePagination = (pagination) => {
    console.log('pagination=>', pagination)
    setPagination(pagination)
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
          <CouponCard info={info} />
          <QRCode className="qr-code" size={240} value={`${h5Host}/#/coupon/${info.baseVO && info.baseVO.id}/share`} />
          <div className="copy-qr-code">
            <Input id="copy-input" readOnly value={`${h5Host}/#/coupon/${info.baseVO && info.baseVO.id}/share`} />
            <Button id="copy-btn" data-clipboard-target="#copy-input" className="ml10" type="primary">复制</Button>
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
            {getFieldDecorator('status', {})(<XtSelect data={receiveStatus.getArray('all')} style={{ width: '174px' }} placeholder="请输入" />)}
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
        </Row>
        <CommonTable loading={loading} onChange={handleChangePagination} rowKey="id" current={pagination.page} pageSize={pagination.pageSize} total={pagination.total} className="mt15" columns={getListColumns()} dataSource={records || []} />
      </Card>
    </>
  )
}

export default Form.create()(CouponList);