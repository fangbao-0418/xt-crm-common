import React, { Component } from 'react';
import { Card, Form, Input, InputNumber, Button, Row } from 'antd';
import { withRouter } from 'react-router-dom';
import refundType from '@/enum/refundType';
import { XtSelect } from '@/components'
import { connect } from '@/util/utils';
import { formatPrice } from '@/util/format';
import { formatMoney, isPendingStatus, isRefundFailedStatus } from '@/pages/helper';
import returnShipping from './components/return-shipping';
import { Decimal } from 'decimal.js';
import AfterSaleSelect from '../components/after-sale-select';
import ModifyAddressModal from './components/modal/ModifyAddressModal';
@connect(state => ({
  data: state['refund.model'].data || {}
}))
@withRouter
class CheckForm extends Component {
  state = {
    returnAddress: {},
    refundType: '',
    addressVisible: false,
    selectedValues: []
  }
  handleAuditOperate = (status) => {
    const { props } = this;
    const fieldsValue = props.form.getFieldsValue();
    if (fieldsValue.refundAmount) {
      fieldsValue.refundAmount = new Decimal(fieldsValue.refundAmount).mul(100).toNumber();
    }
    if (fieldsValue.isRefundFreight === undefined) {
      fieldsValue.isRefundFreight = this.props.checkVO.isRefundFreight;
    }
    let returnAddress = {}
    if (status === 1) {
      returnAddress = this.state.returnAddress;
    }
    console.log('this.state.returnAddress => ', this.state.returnAddress);
    props.dispatch['refund.model'].auditOperate({
      id: props.match.params.id,
      status,
      ...returnAddress,
      ...fieldsValue
    })
  }
  // 重新退款
  handleAgainRefund = async () => {
    const { dispatch, match: { params } } = this.props;
    dispatch['refund.model'].againRefund(params);
  }
  // 关闭订单
  async handleCloseOrder() {
    const { dispatch, match: { params } } = this.props;
    dispatch['refund.model'].closeOrder(params);
  }
  setReturnAddress = (returnAddress) => {
    this.setState({ returnAddress })
  }
  handleChange = (val) => {
    this.setState({ refundType: val })
  }
  // 是否退运费
  isReturnShipping() {
    const { data: { checkVO = {}, orderServerVO = {}, orderInfoVO = {} } } = this.props;
    const { refundAmount } = this.props.form.getFieldsValue(['refundAmount'])
    const hasFreight = checkVO.freight > 0;
    // 是否触发退运费的逻辑
    const isTrigger = (refundAmount * 100) + checkVO.freight + orderServerVO.alreadyRefundAmount === orderInfoVO.payMoney
    return hasFreight && isTrigger;
  }
  getRefundType() {
    return this.props.form.getFieldValue('refundType')
  }
  // 修改地址
  modifyAddress = () => {
    this.setState({ addressVisible: true })
  }
  render() {
    const { orderServerVO = {}, checkVO = {}, refundStatus } = this.props;
    const { getFieldDecorator } = this.props.form;
    const localRefundType = this.state.refundType || orderServerVO.refundType;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }
    return (
      <>
        <Card title="客服审核">
          <Form style={{ width: '60%' }} {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="售后类型">
              {getFieldDecorator('refundType', {
                initialValue: orderServerVO.refundType
              })(<XtSelect style={{ width: 200 }} data={refundType.getArray()} placeholder="请选择售后类型" onChange={this.handleChange} />)}
            </Form.Item>
            <Form.Item label="售后原因">
              <AfterSaleSelect refundType={this.getRefundType()} />
            </Form.Item>
            <Row>
              <Form.Item label="售后数目">
                <InputNumber min={0} max={10} />（可选择数目：0-10）
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
            {localRefundType !== '20' && <Form.Item label="退货地址"><ModifyAddressModal name="八宝" phone="13644445555" address="杭州市余杭区欧美金融中心美国中心南楼"/></Form.Item>}
            {localRefundType === '30' && <Form.Item label="用户收货地址"><ModifyAddressModal name="七宝" phone="13644449999" address="杭州市余杭区欧美金融中心美国中心南楼" /></Form.Item>}
            <Row>
              <Form.Item label="说明">
                {getFieldDecorator('info', {
                })(<Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
              </Form.Item>
            </Row>
            {
              // 待审核状态显示同意和拒绝按钮
              isPendingStatus(refundStatus) && (
                <Form.Item>
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

export default Form.create()(CheckForm);