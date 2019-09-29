import React from 'react';
import { Card, Row, Col, Steps, Table, Button } from 'antd';
import { getDetailColumns } from '../constant';
import refundType from '@/enum/refundType';
import PicturesWall from '../components/pictures-wall';
import { logisticsInformationColumns } from './config';
import CheckForm from './check-form';
import DealForm from './deal-form';
import CheckDetail from './check-detail';
import { replaceHttpUrl } from '@/util/utils';
import { calcCurrent, joinFilterEmpty } from '@/pages/helper'
import createType from '@/enum/createType';
import memberType from '@/enum/memberType';
import { ORDER_TYPE } from '@/config';
import RemarkModal from '../components/remark-modal'
import ProcessResultModal from '../components/modal/ProcessResultModal';
import AfterSaleApplyInfo from './components/AfterSaleApplyInfo';
import { enumRefundStatus } from '../constant';
import moment from 'moment';
interface AfterSalesDetailProps {
  data: AfterSalesInfo.data
  getDetail: any
  refundId: string | number
}
interface AfterSalesDetailState {
  visible: boolean
}
class AfterSalesDetail extends React.Component<AfterSalesDetailProps, AfterSalesDetailState> {
  state: AfterSalesDetailState = {
    visible: false
  }
  render() {
    let { isDelete, orderInfoVO, orderServerVO, refundStatus } = this.props.data;
    orderServerVO = Object.assign({}, orderServerVO)
    orderInfoVO = Object.assign({}, orderInfoVO)
    let current = isDelete === 1 ? 2 : calcCurrent(refundStatus);
    return (
      <>
        <ProcessResultModal visible={this.state.visible} handleCancel={() => this.setState({ visible: false })} />
        <Row type="flex" justify="space-between" align="middle" className="mb10">
          <Col>
            <h3>
              <span>售后单编号：{orderServerVO.orderCode}</span>
              <span className="ml20">售后状态：{orderServerVO.refundStatusStr}</span>
            </h3>
          </Col>
          <Col>
            {enumRefundStatus.WaitConfirm == refundStatus && (
              <RemarkModal
                onSuccess={this.props.getDetail}
                orderCode={orderInfoVO.mainOrderCode}
                refundId={this.props.refundId}
                childOrderId={orderInfoVO.childOrderId}
              />
            )}
            {
              enumRefundStatus.Operating == refundStatus && <Button type="primary" onClick={() => this.setState({ visible: true })}>处理结果</Button>
            }
          </Col>
        </Row>
        {/* 售后完成 */}
        {current === 2 && <CheckDetail {...this.props.data} />}
        <Card
          style={{ marginTop: '0' }}>
          <AfterSaleApplyInfo orderServerVO={orderServerVO}/>
        </Card>
        {current === 0 && <CheckForm {...(this.props.data as any)} />}
        {current === 1 && <DealForm {...this.props.data} />}
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
}
export default AfterSalesDetail;