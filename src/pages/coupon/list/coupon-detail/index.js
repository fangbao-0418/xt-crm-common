import React, { useState, useEffect } from 'react';
import { Tabs, Form, Card, Button, Modal, Table, Message } from 'antd';
import { formLeftButtonLayout, formItemLayout } from '@/config'
import { invalidCoupon, getCouponDetail, getCouponTasks } from '@/pages/coupon/api';
import { releaseRecordsColumns } from '../../config';
import { formatFaceValue, formatDateRange, formatUseTime, formatAvlRange, formatReceiveRestrict, formatPlatformRestrict } from '@/pages/helper';
import emitter from '@/util/events';

const { TabPane } = Tabs;
const { confirm } = Modal;
const columns = [{
  title: 'ID',
  dataIndex: 'id',
  key: 'id'
}, {
  title: '名称',
  dataIndex: 'name',
  key: 'name'
}];


function CouponDetail({ match }) {
  const [couponTasks, setCouponTasks] = useState([]);
  console.log('couponTasks=>', couponTasks)
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { baseVO = {}, ruleVO = {} } = data;
  const fetchDetail = async () => {
    const data = await getCouponDetail(match.params.id);
    setData(data || {});
  }
  const handleInvalidCoupon = () => {
    confirm({
      title: '系统提示',
      content: '优惠券失效后将不能使用是否失效所有优惠券？',
      onOk: async () => {
        const res = await invalidCoupon(match.params.id);
        if (res) {
          Message.info('失效优惠券成功');
        }
        fetchDetail();
      }
    });
  }
  const fetchCouponTasks = async () => {
    try {
      setLoading(true);
      const res = await getCouponTasks(match.params.id);
      setCouponTasks(res);
      setLoading(false);
    } catch (err) {
      setLoading(true);
    }
  }
  useEffect(() => {
    fetchDetail();
    fetchCouponTasks();
    emitter.addListener('list.coupon-detail.fetchCouponTasks', fetchCouponTasks);
    return () => {
      emitter.removeListener('list.coupon-detail.fetchCouponTasks', fetchCouponTasks);
    }
  }, [])
  return (
    <Card>
      <Tabs>
        <TabPane tab="优惠详情" key="1">
          <Form {...formItemLayout}>
            <Form.Item label="优惠券名称">{baseVO.name}</Form.Item>
            <Form.Item label="适用范围">{formatAvlRange(ruleVO.avlRange)}</Form.Item>
            {ruleVO.rangeVOList && ruleVO.rangeVOList.length > 0 && <Form.Item wrapperCol={formLeftButtonLayout}>
              <Table style={{width: '400px'}}　pagination={false} rowKey="id" columns={columns} dataSource={ruleVO.rangeVOList} />
            </Form.Item>}
            {ruleVO.excludeProductVOList && ruleVO.excludeProductVOList.length > 0 && (
              <Form.Item label="以排除商品">
                <Table style={{width: '400px'}}　pagination={false} rowKey="id" columns={columns} dataSource={ruleVO.excludeProductVOList} />
              </Form.Item>
            )}
            <Form.Item label="优惠券价值">{formatFaceValue(ruleVO)}</Form.Item>
            <Form.Item label="发放总量">{baseVO.inventory}</Form.Item>
            <Form.Item label="领取时间">{formatDateRange(ruleVO)}</Form.Item>
            <Form.Item label="用券时间">{formatUseTime(ruleVO)}</Form.Item>
            <Form.Item label="领取人限制">{formatReceiveRestrict(ruleVO.receiveRestrict)}</Form.Item>
            <Form.Item label="每人限领次数">{ruleVO.dailyRestrict}</Form.Item>
            <Form.Item label="使用平台">{formatPlatformRestrict(ruleVO.platformRestrict)}</Form.Item>
            <Form.Item label="优惠券说明">{baseVO.description}</Form.Item>
            <Form.Item label="优惠券备注">{baseVO.remark}</Form.Item>
            {baseVO.status === 2 && <Form.Item wrapperCol={formLeftButtonLayout}>
              {baseVO.isDelete === 1 ? <Button disabled>已失效</Button> : <Button type="danger" onClick={handleInvalidCoupon}>失效优惠券</Button>}
            </Form.Item>}
          </Form>
        </TabPane>
        <TabPane tab="批量发送记录" key="2">
          <Table rowKey="id" columns={releaseRecordsColumns} dataSource={couponTasks}></Table>
        </TabPane>
      </Tabs>
    </Card>
  )
}
export default CouponDetail;