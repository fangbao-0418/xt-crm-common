import React, { Component } from 'react';
import { Input, DatePicker, Button, Row, Col, Form, Table, Card, Divider, Select } from 'antd';
import styles from './index.module.sass';
import moment from 'moment';
import { connect } from '@/util/utils';
import { formatDate, formatMoneyWithSign } from '@/pages/helper';
import { OrderStatusTextMap } from '@/pages/order/constant';
import { isNil } from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(state => ({
  loading: state.loading.models['intercept.detail.order'],
  orderInfo: state['intercept.detail.order'].orderInfo
}))
@Form.create()
export default class extends Component {
  componentDidMount() {
    const {
      dispatch,
      orderInfo: { current, size }
    } = this.props;
    dispatch['intercept.detail.order'].getData({
      page: current,
      pageSize: size
    });
  }

  render() {
    const {
      orderInfo: { records }
    } = this.props;
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderCode'
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        render: val => {
          return formatDate(val);
        }
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        render: val => {
          return OrderStatusTextMap[val];
        }
      },
      {
        title: '实付金额',
        dataIndex: 'totalMoney',
        render: (val, record) => {
          return (
            <div>
              <div>{formatMoneyWithSign(val)}</div>
              <div>含运费：{formatMoneyWithSign(record.freight)}</div>
            </div>
          );
        }
      },
      {
        title: '收货人',
        dataIndex: 'consignee',
        render: (val, record) => {
          return (
            <div>
              <div>{val}</div>
              <div>{record.phone}</div>
            </div>
          );
        }
      },
      {
        title: '操作',
        width: 180,
        render: () => {
          return (
            <Button type="link" style={{ padding: 0 }}>
              查看详情
            </Button>
          );
        }
      }
    ];

    const expandedRowRender = ({ refundStatus, skuList }) => {
      const columns = [
        {
          title: '商品名称',
          dataIndex: 'skuName'
        },
        {
          title: '商品单价',
          dataIndex: 'salePrice'
        },
        {
          title: '购买价',
          dataIndex: 'buyPrice'
        },
        {
          title: '商品数量',
          dataIndex: 'num'
        },
        {
          title: '售后信息',
          dataIndex: 'info',
          hide: isNil(refundStatus)
        },
        {
          title: '售后状态',
          dataIndex: 'refundStatus',
          hide: isNil(refundStatus)
        },
        {
          title: '操作',
          dataIndex: 'record'
        }
      ].filter(column => !column.hide);
      return (
        <Table
          columns={columns}
          dataSource={skuList}
          pagination={false}
          defaultExpandAllRows
          rowKey={record => record.skuId}
        />
      );
    };

    return (
      <div>
        <Card>
          {this.renderForm()}
          <Divider />
          <Table columns={columns} dataSource={records} expandedRowRender={expandedRowRender} />
        </Card>
      </div>
    );
  }

  renderForm = () => {
    const {
      form: { getFieldDecorator }
    } = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 }
      },
      wrapperCol: {
        sm: { span: 16 }
      }
    };

    const twoformItemLayout = {
      labelCol: {
        sm: { span: 4 }
      },
      wrapperCol: {
        sm: { span: 20 }
      }
    };
    return (
      <Form {...formItemLayout} className={styles['search-form']}>
        <Row gutter={24}>
          <Col span={4}>
            <FormItem label="订单编号">{getFieldDecorator('orderCode')(<Input />)}</FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="快递单号">{getFieldDecorator('expressCode')(<Input />)}</FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="商品ID">{getFieldDecorator('goodsCode')(<Input />)}</FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="下单人ID">{getFieldDecorator('createUserId')(<Input />)}</FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="下单人电话">
              {getFieldDecorator('createPhoneNumber')(<Input />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="收货人">{getFieldDecorator('consignee')(<Input />)}</FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="收货人电话">
              {getFieldDecorator('consigneePhoneNumber')(<Input />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...twoformItemLayout} label="下单时间">
              {getFieldDecorator('createDateTime')(
                <RangePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={{
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...twoformItemLayout} label="支付时间">
              {getFieldDecorator('paidDateTime')(
                <RangePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={{
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="订单状态">
              {getFieldDecorator('orderState', {
                initialValue: ''
              })(
                <Select>
                  <Option value={''} key={''}>
                    所有
                  </Option>
                  <Option value={0} key={0}>
                    待付款
                  </Option>
                  <Option value={1} key={1}>
                    待拦截
                  </Option>
                  <Option value={2} key={2}>
                    待发货
                  </Option>
                  <Option value={3} key={3}>
                    已发货
                  </Option>
                  <Option value={4} key={4}>
                    已完成
                  </Option>
                  <Option value={5} key={5}>
                    关闭
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.handleSearch}>
              查询
            </Button>
            <Button onClick={this.onShowModal} style={{ marginLeft: 8 }}>
              清除条件
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };
}
