import React from "react";
import {formatDate} from '@/pages/helper';
import { Row, Col } from 'antd';
function ReturnInformation({checkVO = {}}) {
  return (
    <Row gutter={24}>
      <Col span={8}>物流公司：{checkVO.returnExpressName}</Col>
      <Col span={8}>物流单号：{checkVO.returnExpressCode}</Col>
      <Col span={8}>提交时间：{checkVO.returnExpressTime === 0 ? '': formatDate(checkVO.returnExpressTime)}</Col>
    </Row>
  )
}
export default ReturnInformation;