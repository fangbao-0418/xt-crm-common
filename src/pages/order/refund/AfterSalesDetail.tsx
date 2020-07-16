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
  getInfo(data: AfterSalesInfo.data) {
    let infoStr = data?.supplierHandLogS?.[0]?.info || '[]';
    let result = []
    try {
      result = JSON.parse(infoStr);
    } catch (error) {
      result = infoStr;
    }
    return result;
  }
  render () {
    let { data } = this.props;
    const info = this.getInfo(data);
    return (
      <>
        {this.isRefundStatusOf(enumRefundStatus.WaitConfirm) ? (
          <PendingReview />
        ) : (
          <>
            <AfterSalesProcessing data={data} />
            {/* 仅退款，待客服跟进 */}
            <If condition={Array.isArray(info) && info.length > 0}>
              <Card>
                <h3>供应商处理信息</h3>
                <Row>
                  {info.map((v: any) => (<Col>{v.key}：{v.value}</Col>))}
                </Row>
              </Card>
            </If>
            <If condition={typeof info === 'string'}>
              <Card>
                <h3>供应商处理信息</h3>
                <Row>说明：{info}</Row>
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
