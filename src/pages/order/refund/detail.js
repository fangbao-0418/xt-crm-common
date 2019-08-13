import React, { Component } from 'react';
import { Steps, Card, Table, Row, Col, Tabs } from 'antd';
import { getDetailColumns } from './config';
import refundType from '@/enum/refundType';
import PicturesWall from '../components/pictures-wall';
import { CheckForm, DealForm, CheckDetail } from './components';
import { logColumns, logisticsInformationColumns } from './config';
import moment from 'moment';
import { connect } from '@/util/utils';
import { calcCurrent, joinFilterEmpty } from '@/pages/helper'

@connect(state => ({
  data: state['refund.model'].data || {}
}))
class Detail extends Component {
  getDetail = () => {
    const { dispatch } = this.props;
    dispatch['refund.model'].getDetail({ id: this.props.match.params.id })
  }
  componentWillMount(status) {
    this.getDetail();
  }

  render() {
    const { orderInfoVO = {}, orderServerVO = {}, refundStatus, skuServerLogVO = [] } = this.props.data;
    console.log(this.props.data)
    let current = calcCurrent(refundStatus)
    const status = refundStatus === 30 ? 'finish' : refundStatus === 40 ? 'error' : '';
    const title = refundStatus === 30 ? '完成' : refundStatus === 40 ? '关闭' : '完成';
    return (
      <>
        <Card>
          <Steps current={current}>
            <Steps.Step title="待审核" />
            <Steps.Step title="处理中" />
            <Steps.Step status={status} title={title} />
          </Steps>
        </Card>
        <Card>
          <Tabs>
            <Tabs.TabPane tab="售后详情" key="1">
              <Card title="售后信息" style={{ marginTop: '0' }}>
                <Row gutter={24}>
                  <Col span={8}>售后单编号：{orderServerVO.orderCode}</Col>
                  <Col span={8}>申请时间：{moment(orderServerVO.createTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
                  <Col span={8}>售后类型：{refundType.getValue(orderServerVO.refundType)}</Col>
                  <Col span={8}>售后原因：{orderServerVO.returnReasonStr}</Col>
                  <Col span={8}>售后说明：{orderServerVO.info}</Col>
                  <Col span={8}>售后状态：{orderServerVO.refundStatusStr}</Col>
                  {orderServerVO.refundErrorMsg && <Col span={8}>退款失败原因：{orderServerVO.refundErrorMsg}</Col>}
                </Row>
                <Row>
                  <Col>
                    图片凭证：
                    <PicturesWall disabled={true} readOnly={true} imgUrl={orderServerVO.imgUrl} />
                  </Col>
                </Row>
                <Row>
                  <h4>商品信息</h4>
                  <Table rowKey={record => record.productId} pagination={false} columns={getDetailColumns()} dataSource={orderServerVO.productVO || []} />
                </Row>
              </Card>
              <Card title="订单信息">
                <Row gutter={24}>
                  <Col span={8}>订单编号：{orderInfoVO.mainOrderCode}</Col>
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
                </Row>
                <Row gutter={24}>
                  <Col span={8}>支付方式：{orderInfoVO.platform}</Col>
                  <Col span={8}>支付时间：{moment(orderInfoVO.payTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
                  <Col span={8}>交易流水号：{orderInfoVO.paymentNumber}</Col>
                </Row>
                <Row>
                  <h4>物流信息</h4>
                  <Table rowKey={record => record.id} style={{ width: '400px' }} pagination={false} columns={logisticsInformationColumns} dataSource={orderInfoVO.expressVO || []} />
                </Row>
              </Card>
              {current === 0 && <CheckForm {...this.props.data} />}
              {current === 1 && <DealForm />}
              {current === 2 && <CheckDetail {...this.props.data} />}
            </Tabs.TabPane>
            <Tabs.TabPane tab="操作日志" key="2">
              <Table dataSource={skuServerLogVO} pagination={false} columns={logColumns} />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </>
    )
  }
}
export default Detail;