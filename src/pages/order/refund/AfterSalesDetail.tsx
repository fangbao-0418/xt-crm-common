import React from 'react';
import { connect } from 'react-redux';
import AfterSalesProcessing from './AfterSalesProcessing';
import OrderInfo from './components/OrderInfo';
import PendingReview from './PendingReview';
import { namespace } from './model';
import { Card, Row, Col } from 'antd';
import { If } from '@/packages/common/components'
import { enumRefundStatus, enumRefundType } from '../constant';
interface AfterSalesDetailProps {
  data: AfterSalesInfo.data;
}
interface AfterSalesDetailState {
  visible: boolean;
}
class AfterSalesDetail extends React.Component<AfterSalesDetailProps, AfterSalesDetailState> {
  state: AfterSalesDetailState = {
    visible: false,
  };
  isRefundStatusOf(refundStatus: number) {
    let orderServerVO = Object.assign({}, this.props.data.orderServerVO);
    return orderServerVO.refundStatus === refundStatus;
  }
  render() {
    let { data } = this.props;
    return (
      <>
        {this.isRefundStatusOf(enumRefundStatus.WaitConfirm) ? (
          <PendingReview />
        ) : (
          <>
            <AfterSalesProcessing data={data} />
            {/* 仅退款，待客服跟进 */}
            <If condition={data.refundStatus === enumRefundStatus.WaitCustomerServiceOperating && data.refundType === enumRefundType.Refund}>
              <Card>
                <h3>供应商处理信息</h3>
                <Row>
                  <Col>供应商审核结果</Col>
                  <Col>快递公司</Col>
                  <Col>快递单号</Col>
                  <Col>说明</Col>
                </Row>
              </Card>
            </If>
            {/* 仅退款，供应商超时未处理 */}
            <If condition={data.refundStatus === 28 && data.refundType === enumRefundType.Refund}>
              <Card>
                <h3>供应商处理信息</h3>
                <Row>
                  <Col>供应商审核时间</Col>
                  <Col>审核截至时间</Col>
                </Row>
              </Card>
            </If>
            {/* 仅退款，供应商通过 */}
            <If condition={data.refundStatus === 29 && data.refundType === enumRefundType.Refund}>
              <Card>
                <h3>供应商处理信息</h3>
                <Row>
                  <Col>供应商审核时间</Col>
                  <Col>审核截至时间</Col>
                  <Col>说明</Col>
                </Row>
              </Card>
            </If>
          </>
        )}
        <OrderInfo orderInfoVO={data.orderInfoVO} shopDTO={data.shopDTO} />
      </>
    );
  }
}
export default connect((state: any) => {
  return {
    data: (state[namespace] && state[namespace].data) || {},
  };
})(AfterSalesDetail);
