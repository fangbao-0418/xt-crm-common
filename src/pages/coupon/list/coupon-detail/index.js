import React, { useState, useEffect } from 'react';
import { Tabs, Form, Card, Button, Modal, Table } from 'antd';
import { formLeftButtonLayout, formItemLayout } from '@/config'
import { invalidCoupon, getCouponDetail, getCouponTasks } from '@/pages/coupon/api';
import { releaseRecordsColumns } from '../../config';
const { TabPane } = Tabs;
const { confirm } = Modal;
function callback(key) {
  console.log(key);
}

function CouponDetail({ match }) {
  const [couponTasks, setCouponTasks] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { baseVO = {}, ruleVO = {} } = data;
  const handleInvalidCoupon = () => {
    confirm({
      title: '系统提示',
      content: '优惠券失效后将不能使用是否失效所有优惠券？',
      onOk() {
        invalidCoupon(match.params.id);
      }
    });
  }
  const fetchCouponTasks = async () => {
    try {
      setLoading(true);
      const res = await getCouponTasks();
      setCouponTasks(res.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(true);
    }
  }
  useEffect(() => {
    const fetchDetail = async () => {
      const data = await getCouponDetail(match.params.id);
      setData(data || {});
    }
    fetchDetail();
    fetchCouponTasks();
  }, [])
  return (
    <Card>
      <Tabs onChange={callback}>
        <TabPane tab="优惠详情" key="1">
          <Form {...formItemLayout}>
            <Form.Item label="优惠券名称">{baseVO.name}</Form.Item>
            <Form.Item label="适用范围"></Form.Item>
            <Form.Item label="已选商品"></Form.Item>
            <Form.Item label="优惠券价值"></Form.Item>
            <Form.Item label="发放总量">{baseVO.inventory}</Form.Item>
            <Form.Item label="领取时间"></Form.Item>
            <Form.Item label="用券时间"></Form.Item>
            <Form.Item label="领取人限制"></Form.Item>
            <Form.Item label="每人限领次数">{ruleVO.dailyRestrict}</Form.Item>
            <Form.Item label="使用平台">{ruleVO.platformRestrictValues}</Form.Item>
            <Form.Item label="优惠券说明">{baseVO.description}</Form.Item>
            <Form.Item label="优惠券备注">{baseVO.remark}</Form.Item>
            <Form.Item wrapperCol={formLeftButtonLayout}>
              <Button type="danger" onClick={handleInvalidCoupon}>失效优惠券</Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="批量发送记录" key="2">
          <Table rowKey="code" columns={releaseRecordsColumns} dataSource={couponTasks.list}></Table>
        </TabPane>
      </Tabs>
    </Card>
  )
}
export default CouponDetail;