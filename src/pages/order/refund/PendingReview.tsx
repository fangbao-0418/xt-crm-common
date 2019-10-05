import React from 'react';
import { Card, Form, Input, InputNumber, Button, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import refundType from '@/enum/refundType';
import { XtSelect } from '@/components'
import { formatPrice } from '@/util/format';
import { formatMoney, isPendingStatus, isRefundFailedStatus } from '@/pages/helper';
import returnShipping from './components/return-shipping';
import { Decimal } from 'decimal.js';
import AfterSaleSelect from '../components/after-sale-select';
import ModifyAddressModal from '../components/modal/ModifyAddress';
import { enumRefundType } from '../constant';
import { namespace } from './model';
interface Props extends FormComponentProps, RouteComponentProps<{id: any}>{
  data: AfterSalesInfo.data
}
interface State {
  returnAddress: {},
  refundType: string,
  addressVisible: boolean,
  selectedValues: any[]
}
class PendingReview extends React.Component<Props, State> {
  state = {
    returnAddress: {},
    refundType: '',
    addressVisible: false,
    selectedValues: []
  }
  handleAuditOperate = (status: number) => {
    const { props } = this;
    const fieldsValue = props.form.getFieldsValue();
    if (fieldsValue.refundAmount) {
      fieldsValue.refundAmount = new Decimal(fieldsValue.refundAmount).mul(100).toNumber();
    }
    if (fieldsValue.isRefundFreight === undefined) {
      fieldsValue.isRefundFreight = props.data.checkVO.isRefundFreight;
    }
    let returnAddress = {}
    if (status === 1) {
      returnAddress = this.state.returnAddress;
    }
    APP.dispatch({
      type: `${namespace}/auditOperate`,
      payload: {
        id: props.match.params.id,
        status,
        ...returnAddress,
        ...fieldsValue
      }
    })
  }
  // 重新退款
  handleAgainRefund = async () => {
    APP.dispatch({
      type: `${namespace}/againRefund`,
      payload: this.props.match.params
    })
  }
  // 关闭订单
  async handleCloseOrder() {
    APP.dispatch({
      type: `${namespace}/closeOrder`,
      payload: this.props.match.params
    })
  }
  setReturnAddress = (returnAddress: {}) => {
    this.setState({ returnAddress })
  }
  handleChange = (val: string) => {
    this.setState({ refundType: val })
  }
  get refundAmount() {
    return this.props.form.getFieldValue('refundAmount');
  }
  // 是否退运费
  isReturnShipping() {
    let { data: { checkVO , orderServerVO , orderInfoVO  } } = this.props;
    orderServerVO = Object.assign({}, orderServerVO);
    checkVO = Object.assign({}, checkVO);
    orderInfoVO = Object.assign({}, orderInfoVO);
    const refundAmount = this.refundAmount
    const hasFreight = checkVO.freight > 0;
    // 是否触发退运费的逻辑
    const isTrigger = (refundAmount * 100) + checkVO.freight + orderServerVO.alreadyRefundAmount === orderInfoVO.payMoney
    return hasFreight && isTrigger;
  }
  get refundType() {
    return this.props.form.getFieldValue('refundType')
  }
  // 修改地址
  modifyAddress = () => {
    this.setState({ addressVisible: true })
  }
  render() {
    let { data: {orderServerVO, checkVO, orderInfoVO, refundStatus} } = this.props;
    orderServerVO = Object.assign({}, orderServerVO);
    checkVO = Object.assign({}, checkVO);
    orderInfoVO = Object.assign({}, orderInfoVO);
    const { getFieldDecorator } = this.props.form;
    const localRefundType = this.state.refundType || orderServerVO.refundType;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }
    return (
      <>
        <Card title="客服审核">
          <Form style={{ width: '60%' }} {...formItemLayout}>
            <Form.Item label="售后类型">
              {getFieldDecorator('refundType', {
                initialValue: orderServerVO.refundType
              })(<XtSelect style={{ width: 200 }} data={refundType.getArray()} placeholder="请选择售后类型" onChange={this.handleChange} />)}
            </Form.Item>
            <Form.Item label="售后原因">
              <AfterSaleSelect refundType={this.refundType} />
            </Form.Item>
            <Row>
              <Form.Item label="售后数目">
                <InputNumber min={1} max={10} />（可选择数目：1-10）
              </Form.Item>
            </Row>
            {localRefundType === '20' && <Form.Item label="退款金额">
              {getFieldDecorator('refundAmount', {
                initialValue: formatPrice(checkVO.refundAmount)
              })(<InputNumber min={0.01} max={formatMoney(orderServerVO.productVO && orderServerVO.productVO[0] && orderServerVO.productVO[0].ableRefundAmount)} formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: '100%' }} />)}
            </Form.Item>}
            {
              this.isReturnShipping() && <Form.Item label="退运费">
                {getFieldDecorator('isRefundFreight', { initialValue: checkVO.isRefundFreight })(returnShipping(checkVO))}
              </Form.Item>
            }
            {/* 退货退款、换货才有退货地址 refundType： 10 30*/}
            {localRefundType !== String(enumRefundType.Refund) && <Form.Item label="退货地址">
              <ModifyAddressModal name={checkVO.returnContact} phone={checkVO.returnPhone} province="" city="" district="" street={checkVO.returnAddress}/>
              </Form.Item>}
            {localRefundType === String(enumRefundType.Exchange) && <Form.Item label="用户收货地址">
              <ModifyAddressModal name={orderInfoVO.consignee} phone={orderInfoVO.consigneePhone} province="" city="" district="" street={orderInfoVO.address}/>
            </Form.Item>}
            <Row>
              <Form.Item label="说明">
                {getFieldDecorator('info', {
                })(<Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
              </Form.Item>
            </Row>
            {
              // 待审核状态显示同意和拒绝按钮
              isPendingStatus(refundStatus) && (
                <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
                  <Button type="primary" onClick={() => this.handleAuditOperate(1)}>提交</Button>
                  <Button type="danger" style={{ marginLeft: '20px' }} onClick={() => this.handleAuditOperate(0)}>拒绝请求</Button>
                </Form.Item>
              )
            }
            {
              // 退款失败状态下显示重新退款和售后完成按钮
              isRefundFailedStatus(refundStatus) && (
                <Form.Item>
                  <Button type="primary" onClick={this.handleAgainRefund}>重新退款</Button>
                  <Button type="danger" style={{ marginLeft: '20px' }} onClick={this.handleCloseOrder}>售后完成</Button>
                </Form.Item>
              )
            }
          </Form>
        </Card>
      </>
    )
  }
}


export default Form.create()(connect((state: any) => ({
  data: state[namespace].data || {}
}))(withRouter(PendingReview)));