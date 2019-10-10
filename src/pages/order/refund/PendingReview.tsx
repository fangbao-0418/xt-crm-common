import React from 'react';
import { Card, Form, Input, InputNumber, Button, Row, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { refundType, customerFollowType } from '@/enum';
import { XtSelect } from '@/components';
import { formatPrice } from '@/util/format';
import { formatMoney } from '@/pages/helper';
import ReturnShippingSelect from '../components/ReturnShippingSelect';
import { Decimal } from 'decimal.js';
import AfterSaleSelect from '../components/after-sale-select';
import ModifyAddress from '../components/modal/ModifyAddress';
import AfterSaleDetailTitle from './components/AfterSaleDetailTitle';
import { enumRefundType, enumRefundStatus } from '../constant';
import { namespace } from './model';
import { formItemLayout, formLeftButtonLayout } from '@/config';
import AfterSaleApplyInfo from './components/AfterSaleApplyInfo';
import ModifyReturnAddress from '../components/modal/ModifyReturnAddress';
interface Props extends FormComponentProps, RouteComponentProps<{ id: any }> {
  data: AfterSalesInfo.data;
}
interface State {
  addressVisible: boolean;
  selectedValues: any[];
}
class PendingReview extends React.Component<Props, State> {
  state = {
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
        console.log(values)
        if (values.serverNum == 0) {
          message.error('售后数目必须大于0');
          return;
        }
        if (values.refundAmount) {
          values.refundAmount = new Decimal(values.refundAmount).mul(100).toNumber();
        }
        if (values.isRefundFreight === undefined) {
          values.isRefundFreight = this.props.data.checkVO.isRefundFreight;
        }
        let payload = {
          id: this.props.match.params.id,
          status,
          ...values
        };
        let checkVO = this.props.data.checkVO || {};
        let orderServerVO = this.props.data.orderServerVO || {};
        if (status === 1) {
          payload.returnContact = checkVO.returnContact;
          payload.returnPhone = checkVO.returnPhone;
          payload.returnAddress = checkVO.returnAddress;
          Object.assign(payload, orderServerVO.contactVO)
        }
        APP.dispatch({
          type: `${namespace}/auditOperate`,
          payload,
        });
      }
    });
  };
  get refundAmount() {
    let checkVO = this.props.data.checkVO || {};
    let serverNum = this.props.form.getFieldValue('serverNum');
    return serverNum * checkVO.unitPrice;
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
  get refundType(): number {
    return this.props.form.getFieldValue('refundType');
  }
  /**
   * 修改地址
   */
  modifyAddress = () => {
    this.setState({ addressVisible: true });
  };
  isRefundTypeOf(refundType: number) {
    return this.refundType === refundType;
  }
  isRefundStatusOf(refundStatus: number) {
    let orderServerVO = this.props.data.orderServerVO || {};
    return orderServerVO.refundStatus === refundStatus;
  }
  onSuccess = (values: any) => {
    APP.dispatch({
      type: `${namespace}/saveDefault`,
      payload: {
        data: {
          ...this.props.data,
          checkVO: Object.assign(this.props.data.checkVO, values)
        }
      },
    })
  }
  modifyAddressCb = (values: any) => {
    const orderServerVO = this.props.data.orderServerVO || {}
    let {returnContact, returnPhone, ...rest} = values;
    APP.dispatch({
      type: `${namespace}/saveDefault`,
      payload: {
        data: {
          ...this.props.data,
          orderServerVO: {
            ...orderServerVO,
            contactVO: {
              ...orderServerVO.contactVO,
              ...rest,
              contact: returnContact,
              phone: returnPhone
            }
          }
        }
      },
    })
  }
  render() {
    let {
      data: { orderServerVO, checkVO, orderInfoVO },
    } = this.props;
    orderServerVO = Object.assign({}, orderServerVO);
    checkVO = Object.assign({}, checkVO);
    orderInfoVO = Object.assign({}, orderInfoVO);
    let contactVO = orderServerVO.contactVO || {};
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <Card title={<AfterSaleDetailTitle />}>
          <AfterSaleApplyInfo orderServerVO={orderServerVO} />
        </Card>
        <Card title="客服审核">
          <Form {...formItemLayout} style={{ width: '80%' }}>
            <Form.Item label="售后类型">
              {getFieldDecorator('refundType', {
                initialValue: checkVO.refundType,
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
                  onChange={(value: any) => {
                    this.props.form.setFieldsValue({
                      returnReason: undefined
                    })
                  }}
                />,
              )}
            </Form.Item>
            <Form.Item label="售后原因">
              {getFieldDecorator('returnReason', {
                initialValue: orderServerVO.returnReason,
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
                  initialValue: 0,
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
                  initialValue: checkVO.serverNum,
                  rules: [
                    {
                      required: true,
                      message: '请输入售后数目',
                    },
                  ],
                })(<InputNumber
                    min={1}
                    max={checkVO.maxServerNum}
                    placeholder="请输入"
                    onChange={(value: any) => {
                      let refundAmount = (value || 0) * checkVO.unitPrice;
                      this.props.form.setFieldsValue({
                        refundAmount: (refundAmount / 100) || 0
                      })
                    }}
                  />)}
                <span>（最多可售后数目：{checkVO.maxServerNum}）</span>
              </Form.Item>
            </Row>
            {!this.isRefundTypeOf(enumRefundType.Exchange) && (
              <Form.Item label="退款金额">
                {getFieldDecorator('refundAmount', {
                  initialValue: formatPrice(this.refundAmount),
                  rules: [
                    {
                      required: true,
                      message: '请输入退款金额',
                    },
                  ],
                })(
                  <InputNumber
                    min={0.01}
                    max={+formatPrice(this.refundAmount)}
                    formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />,
                )}
                <span>（最多可退￥{formatPrice(this.refundAmount)}）</span>
              </Form.Item>
            )}
            {this.isReturnShipping() && (
              <Form.Item label="退运费">
                {getFieldDecorator('isRefundFreight', { initialValue: checkVO.isRefundFreight })(
                  <ReturnShippingSelect checkVO={checkVO} />,
                )}
              </Form.Item>
            )}
            {!this.isRefundTypeOf(enumRefundType.Refund) && (
              <Form.Item label="退货地址">
                <ModifyReturnAddress detail={checkVO} onSuccess={this.onSuccess} />
              </Form.Item>
            )}
            {this.isRefundTypeOf(enumRefundType.Exchange) && (
              <Form.Item label="用户收货地址">
                <ModifyAddress detail={{ ...contactVO, returnContact: contactVO.contact, returnPhone: contactVO.phone }} onSuccess={this.modifyAddressCb} />
              </Form.Item>
            )}
            <Row>
              <Form.Item label="说明">
                {getFieldDecorator('info', {})(
                  <Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} />,
                )}
              </Form.Item>
            </Row>
            {/**
             * 待审核状态显示同意和拒绝按钮
             */
              this.isRefundStatusOf(enumRefundStatus.WaitConfirm) && (
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
