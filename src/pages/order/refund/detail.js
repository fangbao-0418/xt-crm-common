import React, { Component } from 'react';
import { Steps, Card, Menu, Table, Row, Col, Form, Select, Input, Button } from 'antd';
import { refundDetail, refundOperate } from '../api';
import { getDetailColumns, expressColumns } from './config';
import refundType from '@/enum/refundType';
import PicturesWall from '../components/pictures-wall';
import {CheckForm, CheckDetail} from './components';
import moment from 'moment';
const { Step } = Steps;
class Detail extends Component {
  state = {
    current: 'detail',
    data: {}
  }
  handleClick = (e) => {
    this.setState({
      current: e.key
    })
  }
  handleSubmit = () => { }
  getDetail = () => {
    refundDetail({ id: this.props.match.params.id }).then(res => {
      this.setState({ data: res.data || {} })
    })
  }
  componentWillMount() {
    this.getDetail();
  }
  render() {
    const { checkVO = {}, orderInfoVO = {}, orderServerVO = {}, refundStatus } = this.state.data;
    let current = 0;
    if (refundStatus === 10) {
      current = 0;
    }
    if (refundStatus >= 20 && refundStatus < 30) {
      current = 1;
    }
    if (refundStatus === 30) {
      current = 2;
    }
    return (
      <>
        <Card>
          <Steps current={current}>
            <Step title="待审核" />
            <Step title="处理中" />
            <Step title="完成" />
          </Steps>
        </Card>
        <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
          <Menu.Item key="detail">售后详情</Menu.Item>
          <Menu.Item key="log">操作日志</Menu.Item>
        </Menu>
        <Card title="售后信息" style={{marginTop: '0', borderTop: 'none'}}>
          <Row gutter={24}>
            <Col span={8}>售后单编号：{orderServerVO.orderCode}</Col>
            <Col span={8}>申请时间：{moment(orderServerVO.createTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
            <Col span={8}>售后类型：{refundType.getValue(orderServerVO.refundType)}</Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>售后原因：{orderServerVO.returnReasonStr}</Col>
            <Col span={8}>售后说明：{orderServerVO.info}</Col>
          </Row>
          <Row>
            <Col>
              图片凭证：
              <PicturesWall readOnly={true} imgUrl={orderServerVO.imgUrl}></PicturesWall>
            </Col>
          </Row>
        </Card>
        <Card title="商品信息">
          <Table columns={getDetailColumns()} dataSource={orderServerVO.productVO || []} />
        </Card>
        <Card title="订单信息">
          <Row gutter={24}>
            <Col span={8}>订单编号：{orderInfoVO.mainOrderCode}</Col>
            <Col span={8}>订单状态：{orderInfoVO.orderStatusStr}</Col>
            <Col span={8}>订单来源：{orderInfoVO.payTypeStr}</Col>
            <Col span={8}>买家名称：{orderInfoVO.name}</Col>
            <Col span={8}>联系电话：{orderInfoVO.phone}</Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>收货信息：{orderInfoVO.consignee + ' ' + orderInfoVO.consigneePhone + ' ' + orderInfoVO.address}</Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>用户备注：{orderInfoVO.remark}</Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>支付方式：{orderInfoVO.platform}</Col>
            <Col span={8}>支付时间：{moment(orderInfoVO.payTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
            <Col span={8}>交易流水号：{orderInfoVO.paymentNumber}</Col>
          </Row>
          <Row gutter={24}>
            <Table dataSource={orderInfoVO.expressVO} columns={expressColumns}></Table>
          </Row>
        </Card>
        {/* <Card>
          <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
            <Form.Item label="售后类型">
              {getFieldDecorator('refundType', {
                initialValue: orderServerVO.refundType
              })(
                <Select
                  placeholder="请选择售后类型"
                  onChange={this.handleSelectChange}
                >
                  {
                    refundType.getArray().map(v => <Option value={v.key} key={v.key}>{v.val}</Option>)
                  }
                </Select>
              )}
            </Form.Item>
            <Form.Item label="退款金额">
              {getFieldDecorator('refundAmount', {
                initialValue: checkVO.refundAmount
              })(<Input />)}
            </Form.Item>
            <Form.Item label="说明">
              {getFieldDecorator('info', {
              })(<TextArea
                placeholder=""
                autosize={{ minRows: 2, maxRows: 6 }}
              />)}
            </Form.Item>
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
        </Card> */}
        {/* <Card>
          <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
            <Form.Item label="物流公司">
              {getFieldDecorator('refundType', {
                initialValue: orderServerVO.refundType
              })(
                <Select
                  placeholder="请选择售后类型"
                  onChange={this.handleSelectChange}
                >
                  {
                    refundType.getArray().map(v => <Option value={v.key} key={v.key}>{v.val}</Option>)
                  }
                </Select>
              )}
            </Form.Item>
            <Form.Item label="物流单号">
              {getFieldDecorator('refundAmount', {
                initialValue: checkVO.refundAmount
              })(<Input />)}
            </Form.Item>
            <Form.Item label="说明">
              {getFieldDecorator('info', {
              })(<TextArea
                placeholder=""
                autosize={{ minRows: 2, maxRows: 6 }}
              />)}
            </Form.Item>
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
        */}
        {/* <Card> 
          <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
            <Form.Item label="售后类型">
              {getFieldDecorator('refundType', {
                initialValue: orderServerVO.refundType
              })(
                <Select
                  placeholder="请选择售后类型"
                  onChange={this.handleSelectChange}
                >
                  {
                    refundType.getArray().map(v => <Option value={v.key} key={v.key}>{v.val}</Option>)
                  }
                </Select>
              )}
            </Form.Item>
            <Form.Item label="退款金额">
              {getFieldDecorator('refundAmount', {
                initialValue: checkVO.refundAmount
              })(<Input />)}
            </Form.Item>
            <Form.Item label="说明">
              {getFieldDecorator('info', {
              })(<TextArea
                placeholder=""
                autosize={{ minRows: 2, maxRows: 6 }}
              />)}
            </Form.Item>
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
        </Card> */}
        {current === 1 && <CheckForm {...this.state.data} refresh={this.getDetail} onAuditOperate={this.handleAuditOperate}/>}
        {current === 2 && <CheckDetail {...this.state.data}/>}
      </>
    )
  }
}
export default Detail;