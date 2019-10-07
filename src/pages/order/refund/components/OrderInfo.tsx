import React from 'react';
import { Card, Row, Col, Table } from 'antd';
import { getDetailColumns } from '../../constant';
import { joinFilterEmpty } from '@/pages/helper';
import { ColumnProps } from 'antd/es/table';
import { logisticsInformationColumns } from '../config';
import memberType from '@/enum/memberType';
import moment from 'moment';
type OrderInfoVO = AfterSalesInfo.OrderInfoVO;
type ProductVO = AfterSalesInfo.ProductVO
const columns: ColumnProps<ProductVO>[] = getDetailColumns();
interface Props extends React.Props<{}> {
  orderInfoVO: OrderInfoVO
}
const OrderInfo: React.FC<Props> = (props: Props) => {
  const orderInfoVO = props.orderInfoVO || {};
  return (
    <Card>
      <h4 style={{marginTop: 0}}>订单信息</h4>
      <Row gutter={24}>
        <Col span={8}>子订单号：{orderInfoVO.childOrderCode}</Col>
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
        <h4>物流信息</h4>
        <Table rowKey={(record: any) => record.id} style={{ width: '400px' }} pagination={false} columns={logisticsInformationColumns} dataSource={orderInfoVO.expressVO || []} />
      </Row>
    </Card>
  )
}
export default OrderInfo;