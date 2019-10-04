import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'antd';
import { enumRefundStatus } from '../../constant';
import { namespace } from '../model';
import { RemarkModal, ModifyLogisticsInfo, CheckExchange } from '../../components/modal';
interface Props extends RouteComponentProps<{ id: any }> {
  data: AfterSalesInfo.data;
}
interface State {
  visible: boolean;
}
class AfterSaleDetailTitle extends React.Component<Props, State> {
  state: State = {
    visible: false,
  };
  constructor(props: Props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
  }
  onSuccess() {
    APP.dispatch({
      type: `${namespace}/getDetail`,
      payload: {
        id: this.props.match.params.id,
      },
    });
  }
  isRefundStatusOf(status: number) {
    let orderServerVO = this.props.data.orderServerVO || {};
    return orderServerVO.refundStatus == status;
  }
  render() {
    let { orderServerVO, orderInfoVO, checkVO } = this.props.data;
    orderServerVO = Object.assign({}, orderServerVO);
    orderInfoVO = Object.assign({}, orderInfoVO);
    checkVO = Object.assign({}, checkVO);
    const { visible } = this.state;
    return (
      <>
        <Row type="flex" justify="space-between" align="middle">
          <Col>
            <h3 style={{ margin: 0 }}>
              <span>售后单编号：{orderServerVO.orderCode}</span>
              <span className="ml20">售后状态：{orderServerVO.refundStatusStr}</span>
            </h3>
          </Col>
          <Col>
            {/* 待审核 */}
            {this.isRefundStatusOf(enumRefundStatus.WaitConfirm) && (
              <RemarkModal
                onSuccess={this.onSuccess}
                orderCode={orderInfoVO.mainOrderCode}
                refundId={this.props.match.params.id}
                childOrderId={orderInfoVO.childOrderId}
              />
            )}
            {/* 待用户发货 */}
            {this.isRefundStatusOf(enumRefundStatus.Operating) && (
              <>
                <ModifyLogisticsInfo
                  title="物流信息上传"
                  visible={visible}
                  onCancel={() => this.setState({ visible: false })}
                  checkVO={checkVO}
                />
                <Button
                  type="primary"
                  onClick={() => this.setState({ visible: true })}
                >
                  上传物流信息
                </Button>
              </>
            )}
            {/* 待平台收货 */}
            {this.isRefundStatusOf(enumRefundStatus.OperatingOfGoods) && <CheckExchange />}
            {/* 待平台发货 */}
            {this.isRefundStatusOf(enumRefundStatus.WaitPlatformDelivery) && (
              <>
                <ModifyLogisticsInfo
                  title="待平台发货"
                  visible={visible}
                  onCancel={() => this.setState({ visible: false })}
                  checkVO={checkVO}
                />
                <Button type="primary" onClick={() => this.setState({visible: true})}>发货</Button>
              </>
            )}
          </Col>
        </Row>
      </>
    );
  }
}

export default connect((state: any) => {
  return {
    data: (state[namespace] && state[namespace].data) || {},
  };
})(withRouter(AfterSaleDetailTitle));
