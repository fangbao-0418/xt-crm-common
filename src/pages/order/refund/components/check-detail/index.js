import React from 'react';
import { Card, Row, Col } from 'antd';
import { formatMoney, joinFilterEmpty } from '@/pages/helper'
import refundType from '@/enum/refundType';
import ReturnInformation from '../return-information';
import DeliveryInformation from '../delivery-information';
import RefundInformation from '../refund-information';

function CheckDetail({ checkVO = {}, orderServerVO = {}, checkType }) {
  return (
    <>
      <Card title="审核信息">
        <Row>
          <Col>审核意见：{checkVO.firstRefundStatusStr || checkVO.refundStatusStr}</Col>
          <Col>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
          {checkVO.refundType != 30 && (
            <>
              <Col>退款金额：￥{formatMoney(checkVO.refundAmount)}</Col>
              <Col>退运费：￥{formatMoney(checkVO.freight)}</Col>
            </>
          )}
          <Col>说明：{checkVO.firstServerDescribe || checkVO.serverDescribe}</Col>
          {orderServerVO.refundType != '20' && <Col>退货信息：{joinFilterEmpty([checkVO.returnContact, checkVO.returnPhone, checkVO.returnAddress])}</Col>}
        </Row>
      </Card>
      {orderServerVO.refundType !== '20' && <ReturnInformation checkVO={checkVO} />}
      {/* 退货退款、仅换货 */}
      {orderServerVO.refundType === '10' && <RefundInformation checkVO={checkVO} orderServerVO={orderServerVO} checkType={checkType} />}
      {orderServerVO.refundType === '30' && <DeliveryInformation checkVO={checkVO} checkType={checkType} refundType={orderServerVO.refundType} />}
    </>
  );
}
export default CheckDetail;