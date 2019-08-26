import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Card, Table, Button, Input } from 'antd';
import XtSelect from '@/components/xt-select';
import { getCouponlist, getCouponDetail } from '../api';
import { pagination, getListColumns } from '../config';
import receiveStatus from '@/enum/receiveStatus';
import emitter from '@/util/events';
import ClipboardJS from "clipboard";
import CouponCard from '../coupon-card';
import QRCode from 'qrcode.react';
import './index.scss';

function CouponList({ form: { getFieldDecorator, getFieldsValue, resetFields }, history, match }) {
  const [records, setRecords] = useState([]);
  const [info, setInfo] = useState({});
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
  const setModalVisible = async ({ visible, id }) => {
    const info = await getCouponDetail(id);
    setInfo(info);
    setVisible(visible)
  }
  useEffect(() => {
    fetchData();
    emitter.addListener('coupon.list.setVisible', setModalVisible)
    emitter.addListener('coupon.list.fetchData', fetchData)
    return () => {
      emitter.removeListener('coupon.list.setVisible', setModalVisible);
      emitter.removeListener('coupon.list.fetchData', fetchData);
    }
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
  const copyLink = () => {
    new ClipboardJS('.copy-input');
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
          <QRCode className="qr-code" size={240} value="http://facebook.github.io/react/" />
          <div className="copy-qr-code">
            <Input className="copy-input" readOnly value="http://facebook.github.io/react/" />
            <Button className="ml10" type="primary" onClick={copyLink}>复制</Button>
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
          {/* <Button icon="plus">批量发送记录</Button> */}
        </Row>
        <Table rowKey="id" loading={loading} pagination={pagination} className="mt15" dataSource={records} columns={getListColumns()} />
      </Card>
    </>
  )
}

export default Form.create()(CouponList);