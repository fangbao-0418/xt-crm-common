import React from 'react';
import { Table, Row, Col, Card, Button } from 'antd';
import { goodsTableColumn, storeType } from '../constant';
import LogisticsInfo from './logistics-info';
import { formatDate } from '../../helper';

const GoodsTable = ({ list = [], childOrder = {}, orderInfo = {}, logistics, query, showModal, memberId, showNotes }) => {
  const columns = [
    ...goodsTableColumn,
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record, index) => (
        <>
          {[20, 30, 40, 50].includes(orderInfo.orderStatus) && <Button type="link" size="small" onClick={() => showModal({ ...record, mainOrderId: orderInfo.id, memberId, childOrder })}>申请售后</Button>}
          <Button type="link" size="small" onClick={() => showNotes(record)}>添加备注</Button>
        </>
      )
    }
  ];

  return (
    <Card>
      <Row gutter={24}>
        <Col span={8}>供应商：{childOrder.storeName}</Col>
        <Col span={8}>分类： {storeType[childOrder.category]}</Col>
        <Col span={8}>供应商订单号：{childOrder.storeOrderId}</Col>
      </Row>
      <Table rowKey={record => record.skuId} columns={columns} dataSource={list} pagination={false} />
      <Row>
        <Col span={2} style={{ minWidth: '7em' }}>客服备注：</Col>
        <Col span={22}>
          <Row>
            {Array.isArray(childOrder.orderLogs) ? childOrder.orderLogs.map(v => <Col>{v.info} （{formatDate(v.createTime)} {v.operator}）</Col>): null}
          </Row>
        </Col>
      </Row>
      <LogisticsInfo mainorderInfo={orderInfo} logistics={logistics} onSuccess={query} orderInfo={childOrder} />
    </Card>
  );
};

export default GoodsTable;
