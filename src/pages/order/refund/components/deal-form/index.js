import React, { Component } from "react";
import { Tabs, Form, Button, Card, Row, Col, Input, Select } from 'antd';
import refundType from '@/enum/refundType';
import moment from 'moment';
const formatTime = v => moment(v).format('YYYY-MM-DD HH:mm:ss');
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
class DealForm extends Component {
  render() {
    const { checkVO = {}, orderServerVO = {} } = this.props;
    const { form: { getFieldDecorator }, checkType } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    return (
      <>
        <Card>
          <Tabs>
            <TabPane tab="客服审核" key="1">
              <Row gutter={24}>
                <Col span={8}>审核意见：{checkVO.firstRefundStatusStr + ' ' + checkVO.refundStatusStr}</Col>
                <Col span={8}>退款类型：{refundType.getValue(checkVO.refundType)}</Col>
                <Col span={8}>退款金额：{checkVO.refundAmount}</Col>
                <Col span={8}>说明：{checkVO.firstServerDescribe}</Col>
                <Col span={8}>退货信息：{checkVO.returnContact + ' ' + checkVO.returnPhone + ' ' + checkVO.returnAddress}</Col>
              </Row>
            </TabPane>
            <TabPane tab="退货信息" key="2">
              <Row gutter={24}>
                <Col span={8}>物流公司：{checkVO.returnExpressName}</Col>
                <Col span={8}>物流单号：{checkVO.returnExpressCode}</Col>
                <Col span={8}>提交时间：{formatTime(checkVO.returnExpressTime)}</Col>
              </Row>
            </TabPane>
            {orderServerVO.refundType === '10' && <TabPane tab="退款信息" key="3">
              <Form {...formItemLayout}>
                <Form.Item label="退款类型">
                  {getFieldDecorator('refundType', {
                    initialValue: orderServerVO.refundType
                  })(
                    <Select
                      placeholder="请选择退款类型"
                    >
                      {
                        refundType.getArray().map(v => <Option value={v.key} key={v.key}>{v.val}</Option>)
                      }
                    </Select>
                  )}
                </Form.Item>
                {checkType !== '30' && <Form.Item label="退款金额">
                  {getFieldDecorator('refundAmount', {
                    initialValue: checkVO.refundAmount
                  })(<Input />)}
                </Form.Item>}
                <Form.Item label="说明">
                  {getFieldDecorator('info', {
                  })(<TextArea
                    placeholder=""
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />)}
                </Form.Item>
              </Form>
            </TabPane>}
            {orderServerVO.refundType === '30 ' && <TabPane tab="发货信息" key="4">
              <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
                <Form.Item label="物流公司">
                  {getFieldDecorator('refundType', {
                    initialValue: orderServerVO.refundType
                  })(
                    <Select
                      placeholder="请选择退款类型"
                    >
                      {
                        refundType.getArray().map(v => <Option value={v.key} key={v.key}>{v.val}</Option>)
                      }
                    </Select>
                  )}
                </Form.Item>
                {checkType !== '30' && <Form.Item label="物流单号">
                  {getFieldDecorator('refundAmount', {
                    initialValue: checkVO.refundAmount
                  })(<Input />)}
                </Form.Item>}
                <Form.Item label="说明">
                  {getFieldDecorator('info', {
                  })(<TextArea
                    placeholder=""
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />)}
                </Form.Item>
              </Form>
            </TabPane>}
          </Tabs>
        </Card>
        <Card>
          <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
              }}
            >
              <Button type="primary" onClick={() => this.handleAuditOperate(1)}>
                同意
            </Button>
              <Button type="danger" style={{ marginLeft: '20px' }} onClick={() => this.handleAuditOperate(0)}>
                拒绝
            </Button>
            </Form.Item>
          </Form>
        </Card>
      </>
    )
  }
}
export default Form.create({ name: 'deal-form' })(DealForm);