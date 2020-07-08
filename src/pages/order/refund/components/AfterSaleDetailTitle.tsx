import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'antd';
import { enumRefundStatus, enumRefundType } from '../../constant';
import { namespace } from '../model';
import Countdown from './countdown'
import {
  RemarkModal,
  ModifyLogisticsInfo,
  CheckExchange,
  CheckRefund,
  CheckBoth,
  PlatformDelivery,
  ComplateAfterSale,
  OperatingFailed,
  CancelAfterSale
} from '../../components/modal';
interface Props extends RouteComponentProps<{ id: any }> {
  data: AfterSalesInfo.data;
}
interface State {
  modifyLogisticsInfoVisible: boolean;
  platformDeliveryVisible: boolean;
}
class AfterSaleDetailTitle extends React.Component<Props, State> {
  state: State = {
    modifyLogisticsInfoVisible: false,
    platformDeliveryVisible: false,
  };
  onSuccess = () => {
    APP.dispatch({
      type: `${namespace}/getDetail`,
      payload: {
        id: this.props.match.params.id,
      },
    });
  }
  isRefundStatusOf(status: number) {
    return this.props.data.refundStatus === status;
  }
  isRefundTypeOf(type: number) {
    return this.props.data.refundType === type;
  }
  render() {
    let { orderServerVO, orderInfoVO, checkVO, expirationClose } = this.props.data;
    orderServerVO = Object.assign({}, orderServerVO);
    orderInfoVO = Object.assign({}, orderInfoVO);
    checkVO = Object.assign({}, checkVO);
    const { modifyLogisticsInfoVisible, platformDeliveryVisible } = this.state;
    return (
      <>
        <Row type="flex" justify="space-between" align="middle">
          <Col>
            <h3 style={{ margin: 0 }}>
              <span>售后单编号：{orderServerVO.orderCode}</span>
              <span className="ml20">售后状态：{orderServerVO.refundStatusStr}</span>
              {/* {enumRefundStatus.Operating === orderServerVO.refundStatus && expirationClose && (
                <span className='ml20' style={{ color: 'red' }}>
                  售后关闭倒计时：<Countdown value={expirationClose} />
                </span>
              )} */}
              {/* {enumRefundStatus.OperatingOfGoods === orderServerVO.refundStatus && (
                <span className='ml20' style={{ color: 'red' }}>
                  自动确认倒计时：<Countdown value={24 * 3600} />
                </span>
              )} */}
              <span className="ml20">供应商审核倒计时：23:22:22</span>
            </h3>
          </Col>
          <Col style={{display: 'flex'}}>
            {/* 待审核 */}
            {this.isRefundStatusOf(enumRefundStatus.WaitConfirm) && (
              <RemarkModal
                onSuccess={this.onSuccess}
                refundId={this.props.match.params.id}
              />
            )}
            {/* 待用户发货 */}
            {this.isRefundStatusOf(enumRefundStatus.Operating) && (
              <>
                <ModifyLogisticsInfo
                  title="物流信息上传"
                  visible={modifyLogisticsInfoVisible}
                  onCancel={() => this.setState({ modifyLogisticsInfoVisible: false })}
                />
                <Button
                  type="primary"
                  onClick={() => this.setState({ modifyLogisticsInfoVisible: true })}
                >
                  上传物流信息
                </Button>
              </>
            )}
            {/* 待平台收货 */}
            {this.isRefundStatusOf(enumRefundStatus.OperatingOfGoods) && (
              <>
                {this.isRefundTypeOf(enumRefundType.Both) && <CheckBoth data={this.props.data}/>}
                {this.isRefundTypeOf(enumRefundType.Exchange) && <CheckExchange checkVO={checkVO} />}
              </>
              
            )}
            {/* 待平台发货 */}
            {this.isRefundStatusOf(enumRefundStatus.WaitPlatformDelivery) && (
              <>
                <PlatformDelivery
                  visible={platformDeliveryVisible}
                  onCancel={() => this.setState({ platformDeliveryVisible: false })}
                  checkVO={checkVO}
                  title="待平台发货"
                />
                <Button
                  type="primary"
                  onClick={() => this.setState({ platformDeliveryVisible: true })}
                >
                  发货
                </Button>
              </>
            )}
            {/* 待用户收货 */}
            {this.isRefundStatusOf(enumRefundStatus.WaitUserReceipt) && <ComplateAfterSale />}
            {this.isRefundStatusOf(enumRefundStatus.OperatingFailed) && <OperatingFailed />}
            {/* 等待客服跟进 */}
            {this.isRefundStatusOf(enumRefundStatus.WaitCustomerServiceOperating) && (
              <>
                {this.isRefundTypeOf(enumRefundType.Both) && <CheckBoth data={this.props.data} />}
                {this.isRefundTypeOf(enumRefundType.Exchange) && <CheckExchange checkVO={checkVO} />}
                {this.isRefundTypeOf(enumRefundType.Refund) && <CheckRefund data={this.props.data} />}
              </>
            )}
            {/* 取消售后 */}
            <CancelAfterSale style={{marginLeft: '10px'}} cancel={this.props.data.cancel}/>
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
