import React from 'react';
import { Card, Row, Col } from 'antd';
import { formatMoney, joinFilterEmpty } from '@/pages/helper'
import refundType from '@/enum/refundType';
import { formatDate, isOnlyRefund, isReturnOfGoodsAndMoney, isOnlyExchange } from '@/pages/helper';
import {ExpressCompanyOptions} from '@/components/express-company-select';
function CheckDetail({ checkVO = {} }) {
  return (
    <>
      <Card title="审核信息">
        <Row>
          {isOnlyRefund(checkVO.refundType) && <Col>审核意见：{checkVO.refundStatusStr}</Col>}
          <Col>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
          {isOnlyRefund(checkVO.refundType) && (
            <>
              <Col>退款金额：￥{formatMoney(checkVO.refundAmount)}</Col>
              <Col>退运费：￥{formatMoney(checkVO.freight)}</Col>
            </>
          )}
          <Col>说明：{checkVO.firstServerDescribe}</Col>
          {!isOnlyRefund(checkVO.refundType) && <Col>退货信息：{joinFilterEmpty([checkVO.returnContact, checkVO.returnPhone, checkVO.returnAddress])}</Col>}
        </Row>
      </Card>
      {/* 仅退货 */}
      {!isOnlyRefund(checkVO.refundType) && (
        <Card title="退货信息">
          <Row>
            <Col>物流公司：{checkVO.returnExpressName || '--'}</Col>
            <Col>物流单号：{checkVO.returnExpressCode || '--'}</Col>
            <Col>提交时间：{(checkVO.returnExpressTime === 0 ? '' : formatDate(checkVO.returnExpressTime)) || '--'}</Col>
          </Row>
        </Card>
      )}
      {/* 退货退款*/}
      {isReturnOfGoodsAndMoney(checkVO.refundType) && (
        <Card title="退款信息">
          <Row>
            <Col>审核意见：{checkVO.refundStatusStr}</Col>
            <Col>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
            <Col>退款金额：￥{formatMoney(checkVO.refundAmount)}</Col>
            <Col>退运费：￥{formatMoney(checkVO.freight)}</Col>
            <Col>说明：{checkVO.serverDescribe}</Col>
          </Row>
        </Card>
      )}
      {/* 仅换货 */}
      {isOnlyExchange(checkVO.refundType) && (
        <Card title="发货信息">
          <Row>
            <Col>审核意见：{checkVO.refundStatusStr}</Col>
            <Col>物流公司：{ExpressCompanyOptions[checkVO.sendExpressName] || '--'}</Col>
            <Col>物流单号：{checkVO.sendExpressCode || '--'}</Col>
            <Col>提交时间：{(checkVO.sendExpressTime === 0 ? '' : formatDate(checkVO.sendExpressTime) || '--')}</Col>
            <Col>说明：{checkVO.serverDescribe}</Col>
          </Row>
        </Card>
      )}
    </>
  );
}
export default CheckDetail;