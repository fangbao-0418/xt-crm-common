import React, { useState } from 'react';
import moment from 'moment';
import { setQuery, parseQuery } from '@/util/utils';
import { Table, Card, Form, Input, Button, Divider, message, Upload, DatePicker, Spin, Row, Col, Select, Modal } from 'antd';
import PayModal from './payModal'
import MoneyRender from '@/components/money-render'
import * as api from '../api'
import { enumPayType, TextMapPayStatus } from '../constant'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class List extends React.Component {
  constructor(props) {
    super(props);
    const params = parseQuery();
    this.state = {
      selectedRowKeys: [],
      supplier: [],
      dataSource: [],
      recordItem: {},
      page: {
        total: 0,
        current: +params.page || 1,
        pageSize: 10
      },
      list: [
      ],
      loading: false,
      visible: false,
      confirmLoading: false,
      modalType: 'look' // look | confirm
    };

  }

  componentDidMount() {
    const params = parseQuery();

    this.fetchData(params);
  }
  componentDidUpdate(prevProps) {
    if (this.props.paymentStatus !== prevProps.paymentStatus) {
      const options = {
        paymentStatus: this.props.paymentStatus,
        pageSize: this.state.page.pageSize,
        page: 1
      };
      this.fetchData(options);
    }
  }
  // 获取商品列表
  fetchData(params = {}) {
    const { paymentStatus } = this.props;
    const { page } = this.state;
    const options = {
      paymentStatus,
      pageSize: page.pageSize,
      page: page.current,
      ...params
    };
    api.getPaymentList(options).then((res = {}) => {
      page.total = res.total;
      this.setState({
        dataSource: res.records,
        page
      });
      setQuery(options);
    })
  }

  // 翻页
  handleChangeTable = e => {
    this.setState(
      {
        page: e
      },
      () => {
        const params = parseQuery();
        this.fetchData({
          ...params,
          page: e.current,
          pageSize: e.pageSize
        });
      }
    );
  };
  // 查询
  handleSearch = () => {
    const { validateFields } = this.props.form;

    const { paymentStatus } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        console.log(vals)
        const params = {
          ...vals,
          startCreateTime: vals.createTime && vals.createTime[0] && +new Date(vals.createTime[0]),
          endCreateTime: vals.createTime && vals.createTime[1] && +new Date(vals.createTime[1]),
          startModifyTime: vals.modifyTime && vals.modifyTime[0] && +new Date(vals.modifyTime[0]),
          endModifyTime: vals.modifyTime && vals.modifyTime[1] && +new Date(vals.modifyTime[1]),
          page: 1,
          pageSize: 10,
          paymentStatus
        };
        delete params.createTime;
        delete params.modifyTime;
        // 查询列表
        this.fetchData(params);
      }
    });
  };

  // 重置条件
  handleReset = () => {
    const { resetFields } = this.props.form;
    const { page } = this.state;
    setQuery({ page: page.current, pageSize: page.pageSize }, true);
    resetFields();
    this.fetchData(parseQuery());
  };
  // 确认支付
  handleConfirm = (record, type) => () => {
    // 查看明细
    if (type === 'look') {
      api.getPaymentDetail(record.id).then(res => {
        this.setState({
          recordItem: res,
          visible: true,
          modalType: type,

        })
      })
    } else {
      this.setState({
        visible: true,

        modalType: type,
        recordItem: record
      })
    }

  };
  handlePayConfirm = () => {
    this.setState({
      visible: false
    })
    this.fetchData()
  };
  handleRejectCancel = () => {
    this.setState({
      visible: false
    })
  };

  render() {
    const { total, pageSize, current, dataSource, recordItem, modalType } = this.state;

    const {
      form: { getFieldDecorator }
    } = this.props;

    const columns = [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
      },
      {
        title: '付款单名称',
        key: 'paymentName',
        dataIndex: 'paymentName'
      },
      {
        title: '结算ID',
        key: 'settId',
        dataIndex: 'settId',

      },
      {
        title: '金额',
        key: 'paymentMoney',
        dataIndex: 'paymentMoney',
        render: MoneyRender
      },
      {
        title: '供应商',
        key: 'storeName',
        dataIndex: 'storeName',

      },
      {
        title: '状态',
        key: 'paymentStatusInfo',
        dataIndex: 'paymentStatusInfo'
      },
      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        render: (createTime) => APP.fn.formatDate(createTime)
      },
      {
        title: '创建人',
        key: 'createName',
        dataIndex: 'createName',
      },
      {
        title: '操作时间',
        key: 'modifyTime',
        dataIndex: 'modifyTime',
        render: (modifyTime) => APP.fn.formatDate(modifyTime)

      },
      {
        title: '操作人',
        key: 'modifyName',
        dataIndex: 'modifyName',
      },
      {
        title: '操作',
        width: '150px',
        render: (operate, record) => (
          <>
            {
              enumPayType.ToBePaid === record.paymentStatus
                ? <Button type="primary" onClick={this.handleConfirm(record, 'confirm')}>确认支付</Button>
                : enumPayType.Freezing === record.paymentStatus
                  ? <Button type="primary" disabled>确认支付</Button>
                  : enumPayType.Paid === record.paymentStatus
                    ? <Button type="link" onClick={this.handleConfirm(record, 'look')}>查看明细</Button>
                    : null
            }
          </>
        )
      }
    ];
    return (
      <Spin tip="操作处理中..." spinning={false}>
        <Card title="筛选">
          <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Row gutter={24}>
              <Col span={6}>
                <FormItem label="结算单ID">
                  {getFieldDecorator('settId', { initialValue: '' })(
                    <Input placeholder="请输入结算单ID" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="供应商">
                  {getFieldDecorator('storeName', { initialValue: '' })(
                    <Input placeholder="请输入供应商名称" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="创建人">
                  {getFieldDecorator('createName', { initialValue: '' })(
                    <Input placeholder="请输入创建人" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="付款单ID">
                  {getFieldDecorator('id', { initialValue: '' })(
                    <Input placeholder="请输入付款单ID" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="操作人">
                  {getFieldDecorator('modifyName', { initialValue: '' })(
                    <Input placeholder="请输入操作人" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="全部">
                  {getFieldDecorator('paymentStatus', { initialValue: '' })(
                    <Select placeholder="请选择">
                      {Object.values(enumPayType).map((v) => (
                        <Select.Option key={v} value={v}>{TextMapPayStatus[v]}</Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="创建时间">
                  {getFieldDecorator('createTime', { initialValue: '' })(
                    <RangePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm"
                      showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="操作时间">
                  {getFieldDecorator('modifyTime', { initialValue: '' })(
                    <RangePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm"
                      showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ margin: '0 10px' }} onClick={this.handleSearch}>查询</Button>
                <Button type="default" onClick={this.handleReset}>清除</Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card style={{ marginTop: 10 }}>
          {dataSource && dataSource.length > 0 ? (
            <Table
              bordered
              columns={columns}
              dataSource={dataSource}
              pagination={{
                current,
                total,
                pageSize,
                onChange: this.handleChangeTable
              }}
              defaultExpandAllRows={true}
              rowKey={record => record.id}
            />
          ) : (
              '暂无数据'
            )}
        </Card>
        {/* 确认提示弹窗 */}
        <PayModal
          modalType={modalType}
          modalProps={{
            visible: this.state.visible,
            onOk: this.handleRejectOk,
            onCancel: this.handleRejectCancel,
            confirmLoading: this.state.confirmLoading
          }}
          handlePayConfirm={this.handlePayConfirm}
          record={recordItem}
        />
      </Spin>
    )
  }
}
export default Form.create()(List);