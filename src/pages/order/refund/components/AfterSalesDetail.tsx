import React from 'react';
import { Card, Row, Col, Steps, Table } from 'antd';
import { getDetailColumns } from '../../constant';
import refundType from '@/enum/refundType';
import PicturesWall from '../../components/pictures-wall';
import { logisticsInformationColumns } from '../config';
import { CheckForm, DealForm, CheckDetail } from '../components';
import { replaceHttpUrl } from '@/util/utils';
import { calcCurrent, joinFilterEmpty } from '@/pages/helper'
import createType from '@/enum/createType';
import memberType from '@/enum/memberType';
import { ORDER_TYPE } from '@/config';
import RemarkModal from '../../components/remark-modal'
import moment from 'moment';
function AfterSalesDetail(props: any) {
  const { isDelete, orderInfoVO = {}, orderServerVO = {}, refundStatus } = props.data;
  let current = isDelete === 1 ? 2 : calcCurrent(refundStatus);
  return (
    <>
      {/* 售后完成 */}
      {current === 2 && <CheckDetail {...props.data} />}
      <Card
        title={
          <div>
            <span>售后单编号：{orderInfoVO.mainOrderCode}</span>
            <span className="ml20">售后状态：{orderInfoVO.orderStatusStr}</span>
          </div>
        }
        extra={
          <RemarkModal
            onSuccess={props.getDetail}
            orderCode={orderInfoVO.mainOrderCode}
            refundId={props.refundId}
            childOrderId={orderInfoVO.childOrderId}
          />
        }
        style={{ marginTop: '0' }}>
        <h4>售后申请信息</h4>
        <Row gutter={24}>
          <Col span={8}>售后类型：{refundType.getValue(orderServerVO.refundType)}</Col>
          <Col span={8}>售后原因：{orderServerVO.returnReasonStr}</Col>
          <Col span={8}>申请时间：{moment(orderServerVO.createTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
          <Col span={8}>最后处理时间：{moment(orderServerVO.handleTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
          <Col span={8}>处理人：{orderServerVO.operator}</Col>
          <Col span={8}>申请人类型：{orderServerVO.createType}</Col>
          <Col span={8}>售后说明：{orderServerVO.info}</Col>
        </Row>
        <Row>
          <Col>
            图片凭证：
          {orderServerVO.imgUrl && <PicturesWall disabled={true} readOnly={true} imgUrl={replaceHttpUrl(orderServerVO.imgUrl)} />}
          </Col>
        </Row>
        <Row>
          <h4>售后商品</h4>
          <Table rowKey={record => record.productId} pagination={false} columns={getDetailColumns()} dataSource={orderServerVO.productVO || []} />
        </Row>
      </Card>
      {current === 0 && <CheckForm {...props.data} />}
      {current === 1 && <DealForm {...props.data} />}
      <Card title="订单信息">
        <Row gutter={24}>
          <Col span={8}>子订单号：{orderInfoVO.mainOrderCode}</Col>
          <Col span={8}>订单状态：{orderInfoVO.orderStatusStr}</Col>
          <Col span={8}>订单来源：{orderInfoVO.payTypeStr}</Col>
          <Col span={8}>买家名称：{orderInfoVO.name}</Col>
          <Col span={8}>联系电话：{orderInfoVO.phone}</Col>
        </Row>
        <Row gutter={24}>
          <Col>收货信息：{joinFilterEmpty([orderInfoVO.consignee, orderInfoVO.consigneePhone, orderInfoVO.address])}</Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>用户备注：{orderInfoVO.remark}</Col>
          <Col span={8}>会员等级：{memberType.getValue(orderInfoVO.orderMemberType)}</Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>支付方式：{orderInfoVO.platform}</Col>
          <Col span={8}>支付时间：{moment(orderInfoVO.payTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
          <Col span={8}>交易流水号：{orderInfoVO.paymentNumber}</Col>
        </Row>
        <Row>
          <h4>商品信息：</h4>
          <Table></Table>
        </Row>
        <Row>
          <h4>物流信息</h4>
          <Table rowKey={(record: any) => record.id} style={{ width: '400px' }} pagination={false} columns={logisticsInformationColumns} dataSource={orderInfoVO.expressVO || []} />
        </Row>
      </Card>
    </>
  )
}
export default AfterSalesDetail;