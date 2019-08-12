import React, { Component } from 'react';
import { Steps, Card, Table, Row, Col, Tabs } from 'antd';
import { getDetailColumns, expressColumns } from './config';
import refundType from '@/enum/refundType';
import PicturesWall from '../components/pictures-wall';
import { CheckForm, DealForm, CheckDetail } from './components';
import { logColumns } from './config';
import moment from 'moment';
import { connect } from '@/util/utils';
import { calcCurrent } from '@/pages/helper'
const { Step } = Steps;
const { TabPane } = Tabs;

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
    const { orderInfoVO = {}, orderServerVO = {}, refundStatus } = this.props.data;
    let current = calcCurrent(refundStatus)
    return (
      <>
        <Card>
          <Steps current={current}>
            <Step title="待审核" />
            <Step title="处理中" />
            {refundStatus === 30 && <Step status="finish" title="完成" />}
            {refundStatus === 40 && <Step status="error" title="关闭" />}
          </Steps>
        </Card>
        <Card>
          <Tabs>
            <TabPane tab="售后详情" key="1">
              <Card title="售后信息" style={{ marginTop: '0' }}>
                <Row gutter={24}>
                  <Col span={8}>售后单编号：{orderServerVO.orderCode}</Col>
                  <Col span={8}>申请时间：{moment(orderServerVO.createTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
                  <Col span={8}>售后类型：{refundType.getValue(orderServerVO.refundType)}</Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>售后原因：{orderServerVO.returnReasonStr}</Col>
                  <Col span={8}>售后说明：{orderServerVO.info}</Col>
                </Row>
                <Row>
                  <Col>
                    图片凭证：
                <PicturesWall readOnly={true} imgUrl={orderServerVO.imgUrl}></PicturesWall>
                  </Col>
                </Row>
              </Card>
              <Card title="商品信息">
                <Table pagination={false} columns={getDetailColumns()} dataSource={orderServerVO.productVO || []} />
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
                  <Col span={8}>收货信息：{orderInfoVO.consignee + ' ' + orderInfoVO.consigneePhone + ' ' + orderInfoVO.address}</Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>用户备注：{orderInfoVO.remark}</Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>支付方式：{orderInfoVO.platform}</Col>
                  <Col span={8}>支付时间：{moment(orderInfoVO.payTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
                  <Col span={8}>交易流水号：{orderInfoVO.paymentNumber}</Col>
                </Row>
                <Row gutter={24}>
                  <Table dataSource={orderInfoVO.expressVO} columns={expressColumns}></Table>
                </Row>
              </Card>
              {current === 0 && <CheckForm {...this.props.data} />}
              {current === 1 && <DealForm {...this.props.data} />}
              {current === 2 && <CheckDetail {...this.props.data} />}
            </TabPane>
            <TabPane tab="操作日志" key="2">
              <Table dataSource={[]} columns={logColumns} />
            </TabPane>
          </Tabs>
        </Card>
      </>
    )
  }
}
export default Detail;