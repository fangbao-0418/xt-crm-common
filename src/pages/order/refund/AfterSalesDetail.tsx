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
    visible: false
  };
  isRefundStatusOf (refundStatus: number) {
    const orderServerVO = Object.assign({}, this.props.data.orderServerVO)
    return orderServerVO.refundStatus === refundStatus
  }

  render () {
    let { data } = this.props;
    const infoStr = data?.supplierHandLogS?.[0]?.info || '[]'
    const info = JSON.parse(infoStr);
    return (
      <>
        {this.isRefundStatusOf(enumRefundStatus.WaitConfirm) ? (
          <PendingReview />
        ) : (
          <>
            <AfterSalesProcessing data={data} />
            {/* 仅退款，待客服跟进 */}
            <If condition={info && info.length > 0}>
              <Card>
                <h3>供应商处理信息</h3>
                <Row>
                  {info.map((v: any) => (<Col>{v.key}：{v.value}</Col>))}
                </Row>
              </Card>
            </If>
          </>
        )}
        <OrderInfo orderInfoVO={data.orderInfoVO} shopDTO={data.shopDTO} />
      </>
    )
  }
}
export default connect((state: any) => {
  return {
    data: (state[namespace] && state[namespace].data) || {}
  }
})(AfterSalesDetail)
