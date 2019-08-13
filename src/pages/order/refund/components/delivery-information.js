import React, { Component } from 'react';
import { Form, Card, Input, Button, Row, Col } from 'antd';
import { formItemLayout, formButtonLayout } from '@/config'
import { connect } from '@/util/utils';
import { withRouter } from 'react-router-dom';
import ExpressCompanySelect from '@/components/express-company-select';
import { formatDate } from '@/pages/helper';

@connect(state => ({
  data: state['refund.model'].data || {}
}))
@withRouter
@Form.create({ name: 'delivery-information' })
class DeliveryInformation extends Component {
  handleAuditOperate = (status) => {
    const { props } = this;
    const fields = props.form.getFieldsValue();
    props.dispatch['refund.model'].auditOperate({
      id: props.match.params.id,
      status,
      refundType: props.data.orderServerVO.refundType,
      ...fields
    });
  }
  render() {
    const { form: { getFieldDecorator }, data: { checkType, checkVO = {} }, readOnly = true } = this.props;
    if (readOnly) {
      return (
        <Card title="发货信息">
          <Row>
            <Col>物流公司：{checkVO.sendExpressName}</Col>
            <Col>物流单号：{checkVO.sendExpressCode}</Col>
            <Col>提交时间：{checkVO.sendExpressTime === 0 ? '' : formatDate(checkVO.sendExpressTime)}</Col>
          </Row>
        </Card>
      )
    }
    else {
      return <Form {...formItemLayout}>
        <Form.Item label="物流公司">
          {getFieldDecorator('expressName', {})(<ExpressCompanySelect style={{ width: '100%' }} placeholder="请选择物流公司" />)}
        </Form.Item>
        {checkType !== '30' && <Form.Item label="物流单号">
          {getFieldDecorator('expressCode', {})(<Input placeholder="请输入物流单号" />)}
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
export default DeliveryInformation;