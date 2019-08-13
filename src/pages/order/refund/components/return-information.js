import React from "react";
import {formatDate} from '@/pages/helper';
import { Card, Row, Col } from 'antd';
function ReturnInformation({checkVO = {}}) {
  return (
    <Card title="退货信息">
      <Row>
        <Col>物流公司：{checkVO.returnExpressName}</Col>
        <Col>物流单号：{checkVO.returnExpressCode}</Col>
        <Col>提交时间：{checkVO.returnExpressTime === 0 ? '': formatDate(checkVO.returnExpressTime)}</Col>
      </Row>
    </Card>
  
  )
}
export default ReturnInformation;