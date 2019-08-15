import React from "react";
import {formatDate} from '@/pages/helper';
import { Card, Row, Col } from 'antd';

const CardTitle = ({refundStatus}) => <div>退货信息{refundStatus === 20 && <span style={{color: '#999'}}>（待买家上传物流信息）</span>}</div>
function ReturnInformation({checkVO = {}, refundStatus}) {
  console.log('refundStatus=>', refundStatus)
  return (
    <Card title={<CardTitle refundStatus={refundStatus}/>}>
      <Row>
        <Col>物流公司：{checkVO.returnExpressName || '--'}</Col>
        <Col>物流单号：{checkVO.returnExpressCode || '--'}</Col>
        <Col>提交时间：{(checkVO.returnExpressTime === 0 ? '': formatDate(checkVO.returnExpressTime)) || '--'}</Col>
      </Row>
    </Card>
  )
}
export default ReturnInformation;