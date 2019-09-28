import React from 'react';
import { Card, Row, Col } from 'antd';
import { formatMoney, joinFilterEmpty } from '@/pages/helper'
import refundType from '@/enum/refundType';
import { formatDate, isOnlyRefund, isReturnOfGoodsAndMoney, isOnlyExchange } from '@/pages/helper';
import { ExpressCompanyOptions } from '@/components/express-company-select';
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
      {/* 仅退款 */}
      {!isOnlyRefund(checkVO.refundType) && (
        <>
          <Card title="客服处理信息">
            <Row>
              <Col>售后类型：仅退款</Col>
              <Col>是否发货：否</Col>
              <Col>售后数目：2</Col>
              <Col>退款金额：250</Col>
              <Col>退运费：¥15</Col>
              <Col>说明：不想要不想要了不想要了不想要了不想要了不想要了不想要了不想要了不想   要了不想要了不想要了了</Col>
            </Row>
          </Card>
          <Card title="退款信息">
            <Row>
              <Col>退款方式：自动退款</Col>
              <Col>退款发起时间：2019.10.9  19:00:00</Col>
              <Col>退款失败时间：2019.10.9  19:10:00</Col>
              <Col>退款完成时间：2019.10.9  19:10:00</Col>
              <Col>退款凭证：0CSXKOP1232413</Col>
            </Row>
          </Card>
        </>
      )}
      {/* 退货退款*/}

      {isReturnOfGoodsAndMoney(checkVO.refundType) && (
        <>
          <Card title="客服处理信息">
            <Row>
              <Col>售后类型：退货退款</Col>
              <Col>售后数目：   2</Col>
              <Col>退款金额：250</Col>
              <Col>退款地址： 八宝  13644445555 杭州市余杭区欧美金融中心美国中心南楼</Col>
              <Col>说    明： 安排售后退货退款1个，退款2450元</Col>
            </Row>
          </Card>
          <Card title="用户发货物流信息">
            <Row>
              <Col>物流公司：天天快递</Col>
              <Col>物流单号：30190418131456778899</Col>
            </Row>
          </Card>
          <Card title="供应商处理信息">
            <Row>
              <Col>供应商名称：喜团义乌自营仓</Col>
              <Col>供应商类型：自营仓/大供应商/小供应商</Col>
              <Col>供应商收货状态：已收货</Col>
              <Col>收货数目：2</Col>
              <Col>说明：货品已收货，可以进行售后</Col>
            </Row>
          </Card>
          <Card title="退款信息">
            <Row>
              <Col>退款方式：自动退款</Col>
              <Col>退款平台：支付宝</Col>
              <Col>退款发起时间：2019.10.9  19:00:00</Col>
              <Col>退款完成时间：2019.10.9  19:10:00</Col>
              <Col>退款凭证：0CSXKOP1232413</Col>
            </Row>
          </Card>
        </>
      )}
      {/* 仅换货 */}
      {isOnlyExchange(checkVO.refundType) && (
        <>
          <Card title="客服处理信息">
            <Row>
              <Col>售后类型：换货</Col>
              <Col>售后数目：   2</Col>
              <Col>退货地址： 八宝  13644445555 杭州市余杭区欧美金融中心美国中心南楼</Col>
              <Col>收货地址： 八宝  13644445555 杭州市余杭区欧美金融中心美国中心南楼</Col>
              <Col>说    明： 安排售后换货2个</Col>
            </Row>
          </Card>
          <Card title="用户发货物流信息">
            <Row>
              <Col>物流公司：天天快递</Col>
              <Col>物流单号：30190418131456778899</Col>
            </Row>
          </Card>
          <Card title="供应商处理信息">
            <Row>
              <Col>供应商名称：喜团义乌自营仓</Col>
              <Col>供应商类型：自营仓/大供应商/小供应商</Col>
              <Col>供应商收货状态：已收货</Col>
              <Col>收货数目：2</Col>
              <Col>说明：货品已收货，可以进行售后</Col>
              <Col>物流公司：天天快递 物流单号：30190418131456778899</Col>
            </Row>
          </Card>
        </>
      )}
    </>
  );
}
export default CheckDetail;