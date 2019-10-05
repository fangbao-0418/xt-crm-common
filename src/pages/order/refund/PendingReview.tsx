import React from 'react';
import { Card, Form, Input, InputNumber, Button, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { refundType, customerFollowType } from '@/enum';
import { XtSelect } from '@/components';
import { formatPrice } from '@/util/format';
import { formatMoney, isPendingStatus, isRefundFailedStatus } from '@/pages/helper';
import returnShipping from './components/return-shipping';
import { Decimal } from 'decimal.js';
import AfterSaleSelect from '../components/after-sale-select';
import ModifyAddressModal from '../components/modal/ModifyAddress';
import { enumRefundType } from '../constant';
import { namespace } from './model';
import { formItemLayout, formLeftButtonLayout } from '@/config';
interface Props extends FormComponentProps, RouteComponentProps<{ id: any }> {
  data: AfterSalesInfo.data;
}
interface State {
  returnAddress: {};
  addressVisible: boolean;
  selectedValues: any[];
}
class PendingReview extends React.Component<Props, State> {
  state = {
    returnAddress: {},
    addressVisible: false,
    selectedValues: [],
  };
  /**
   * 客服审核
   * @param status {number} 0:拒绝,1:同意
   */
  handleAuditOperate = (status: number) => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        if (values.refundAmount) {
          values.refundAmount = new Decimal(values.refundAmount).mul(100).toNumber();
        }
        if (values.isRefundFreight === undefined) {
          values.isRefundFreight = this.props.data.checkVO.isRefundFreight;
        }
        let returnAddress = {};
        if (status === 1) {
          returnAddress = this.state.returnAddress;
        }
        APP.dispatch({
          type: `${namespace}/auditOperate`,
          payload: {
            id: this.props.match.params.id,
            status,
            ...returnAddress,
            ...values,
          },
        });
      }
    });
  };
  // 重新退款
  handleAgainRefund = async () => {
    APP.dispatch({
      type: `${namespace}/againRefund`,
      payload: this.props.match.params,
    });
  };
  // 关闭订单
  async handleCloseOrder() {
    APP.dispatch({
      type: `${namespace}/closeOrder`,
      payload: this.props.match.params,
    });
  }
  setReturnAddress = (returnAddress: {}) => {
    this.setState({ returnAddress });
  };
  get refundAmount() {
    return this.props.form.getFieldValue('refundAmount');
  }
  // 是否退运费
  isReturnShipping() {
    let {
      data: { checkVO, orderServerVO, orderInfoVO },
    } = this.props;
    orderServerVO = Object.assign({}, orderServerVO);
    checkVO = Object.assign({}, checkVO);
    orderInfoVO = Object.assign({}, orderInfoVO);
    const refundAmount = this.refundAmount;
    const hasFreight = checkVO.freight > 0;
    // 是否触发退运费的逻辑
    const isTrigger =
      refundAmount * 100 + checkVO.freight + orderServerVO.alreadyRefundAmount ===
      orderInfoVO.payMoney;
    return hasFreight && isTrigger;
  }
  /**
   * 获取售后类型
   * @returns {string|*}
   */
  get refundType(): string {
    return this.props.form.getFieldValue('refundType');
  }
  // 修改地址
  modifyAddress = () => {
    this.setState({ addressVisible: true });
  };
  isRefundTypeOf(refundType: string): boolean {
    return this.refundType === refundType;
  }
  render() {
    let {
      data: { orderServerVO, checkVO, orderInfoVO, refundStatus },
    } = this.props;
    orderServerVO = Object.assign({}, orderServerVO);
    checkVO = Object.assign({}, checkVO);
    orderInfoVO = Object.assign({}, orderInfoVO);
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <Card title="客服审核">
          <Form {...formItemLayout} style={{width: '80%'}}>
            <Form.Item label="售后类型">
              {getFieldDecorator('refundType', {
                initialValue: orderServerVO.refundType,
                rules: [
                  {
                    required: true,
                    message: '请选择售后类型',
                  },
                ],
              })(
                <XtSelect
                  style={{ width: 200 }}
                  data={refundType.getArray()}
                  placeholder="请选择售后类型"
                />,
              )}
            </Form.Item>
            <Form.Item label="售后原因">
              {getFieldDecorator('returnReason', {
                rules: [
                  {
                    required: true,
                    message: '请选择售后原因',
                  },
                ],
              })(<AfterSaleSelect refundType={this.refundType} />)}
            </Form.Item>
            {this.isRefundTypeOf(enumRefundType.Refund) && (
              <Form.Item label="是否需要客服跟进">
                {getFieldDecorator('isCustomerFollow', {
                  initialValue: 1,
                  rules: [
                    {
                      required: true,
                      message: '请选择是否需要客服跟进',
                    },
                  ],
                })(<XtSelect data={customerFollowType.getArray()} style={{ width: 200 }} />)}
              </Form.Item>
            )}
            <Row>
              <Form.Item label="售后数目">
                {getFieldDecorator('serverNum', {
                  initialValue: orderServerVO.serverNum,
                  rules: [
                    {
                      required: true,
                      message: '请输入售后数目',
                    },
                  ],
                })(<InputNumber min={1} max={10} placeholder="请输入" />)}
                <span>（可选择数目：1-10）</span>
              </Form.Item>
            </Row>
            {this.isRefundTypeOf(enumRefundType.Refund) && (
              <Form.Item label="退款金额">
                {getFieldDecorator('refundAmount', {
                  initialValue: formatPrice(checkVO.refundAmount),
                  rules: [
                    {
                      required: true,
                      message: '请输入退款金额',
                    },
                  ],
                })(
                  <InputNumber
                    min={0.01}
                    max={formatMoney(
                      orderServerVO.productVO &&
                        orderServerVO.productVO[0] &&
                        orderServerVO.productVO[0].ableRefundAmount,
                    )}
                    formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    style={{ width: '100%' }}
                  />,
                )}
              </Form.Item>
            )}
            {this.isReturnShipping() && (
              <Form.Item label="退运费">
                {getFieldDecorator('isRefundFreight', { initialValue: checkVO.isRefundFreight })(
                  returnShipping(checkVO),
                )}
              </Form.Item>
            )}
            {!this.isRefundTypeOf(enumRefundType.Refund) && (
              <Form.Item label="退货地址">
                <ModifyAddressModal
                  name={checkVO.returnContact}
                  phone={checkVO.returnPhone}
                  province=""
                  city=""
                  district=""
                  street={checkVO.returnAddress}
                />
              </Form.Item>
            )}
            {this.isRefundTypeOf(enumRefundType.Exchange) && (
              <Form.Item label="用户收货地址">
                <ModifyAddressModal
                  name={orderInfoVO.consignee}
                  phone={orderInfoVO.consigneePhone}
                  province=""
                  city=""
                  district=""
                  street={orderInfoVO.address}
                />
              </Form.Item>
            )}
            <Row>
              <Form.Item label="说明">
                {getFieldDecorator('info', {})(
                  <Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} />,
                )}
              </Form.Item>
            </Row>
            {// 待审核状态显示同意和拒绝按钮
            isPendingStatus(refundStatus) && (
              <Form.Item wrapperCol={formLeftButtonLayout}>
                <Button type="primary" onClick={() => this.handleAuditOperate(1)}>
                  提交
                </Button>
                <Button
                  type="danger"
                  style={{ marginLeft: '20px' }}
                  onClick={() => this.handleAuditOperate(0)}
                >
                  拒绝请求
                </Button>
              </Form.Item>
            )}
            {// 退款失败状态下显示重新退款和售后完成按钮
            isRefundFailedStatus(refundStatus) && (
              <Form.Item wrapperCol={formLeftButtonLayout}>
                <Button type="primary" onClick={this.handleAgainRefund}>
                  重新退款
                </Button>
                <Button
                  type="danger"
                  style={{ marginLeft: '20px' }}
                  onClick={this.handleCloseOrder}
                >
                  售后完成
                </Button>
              </Form.Item>
            )}
          </Form>
        </Card>
      </>
    );
  }
}

export default Form.create()(
  connect((state: any) => ({
    data: state[namespace].data || {},
  }))(withRouter(PendingReview)),
);
