import React, { Component } from 'react';
import { Form, Input, InputNumber, Button, Row, Col } from 'antd';
import { formItemLayout, formButtonLayout } from '@/config'
import { XtSelect } from '@/components'
import refundType from '@/enum/refundType';
import { connect } from '@/util/utils';
import { withRouter } from 'react-router-dom';
import { formatMoney } from '@/pages/helper';
@connect(state => ({
  data: state['refund.model'].data || {}
}))
@withRouter
@Form.create({ name: 'refund-information' })
class RefundInformation extends Component {
  handleAuditOperate = (status) => {
    const { dispatch, match: { params: { id } }, form: { getFieldsValue } } = this.props;
    const fields = getFieldsValue();
    fields.refundAmount = fields.refundAmount * 100;
    dispatch['refund.model'].auditOperate({
      id,
      status,
      ...fields
    });
  }
  render() {
    const { form: { getFieldDecorator }, data: { orderServerVO, checkType, checkVO }, readOnly = true } = this.props;
    if (readOnly) {
      return <Row gutter={24}>
        <Col span={8}>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
        <Col span={8}>退款金额：￥{formatMoney(checkVO.refundAmount)}</Col>
        <Col span={8}>说明{checkVO.info}</Col>
      </Row>
    } else {
      return <Form {...formItemLayout}>
        <Form.Item label="退款类型">
          {getFieldDecorator('refundType', {
            initialValue: orderServerVO.refundType
          })(<XtSelect placeholder="请选择退款类型" data={refundType.getArray()} />)}
        </Form.Item>
        {checkType !== '30' && <Form.Item label="退款金额">
          {getFieldDecorator('refundAmount', {
            initialValue: formatMoney(checkVO.refundAmount)
          })(<InputNumber formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: '100%' }} max={formatMoney(checkVO.refundAmount)} />)}
        </Form.Item>}
        <Form.Item label="说明">
          {getFieldDecorator('info', {
          })(<Input.TextArea
            placeholder=""
            autosize={{ minRows: 2, maxRows: 6 }}
          />)}
        </Form.Item>
        <Form.Item wrapperCol={formButtonLayout} style={{ marginBottom: 0 }}>
          <Button type="primary" onClick={() => this.handleAuditOperate(1)}>提交</Button>
          <Button type="danger ml20" onClick={() => this.handleAuditOperate(0)}>拒绝</Button>
        </Form.Item>
      </Form>
    }
  }
}
export default RefundInformation;