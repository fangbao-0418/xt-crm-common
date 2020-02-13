import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import moment from 'moment';
import { Table, Card, Form, Input, Button, Divider, DatePicker, Spin, Row, Col, Select, Modal } from 'antd';
import SettleModal from './settleModal'
import { enumSettleType, TextMapSettleStatus } from '../constant'
import { setQuery, parseQuery, gotoPage } from '@/util/utils';

import * as api from '../api'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class List extends React.Component {
  constructor(props) {
    super(props)
    const params = parseQuery();
    this.state = {
      status: params.status || 0,
      selectedRowKeys: [],
      dataSource: [
        { id: 1, createName: 2, createTime: 2, currencyInfo: 5, accountInfo: 'etwtesh', invoiceInfo: 1, modifyName: 1, modifyTime: 1, payType: 1, settStatusInfo: 10, settlementMoney: 1, storeName: 1 },
        { id: 11, createName: 2, createTime: 2, currencyInfo: 5, accountInfo: '444', invoiceInfo: 0, modifyName: 1, modifyTime: 1, payType: 1, settStatusInfo: 20, settlementMoney: 1, storeName: 1 },
        { id: 111, createName: 2, createTime: 2, currencyInfo: 5, accountInfo: '445555', invoiceInfo: 1, modifyName: 1, modifyTime: 1, payType: 1, settStatusInfo: 30, settlementMoney: 1, storeName: 1 },
        { id: 1111, createName: 2, createTime: 2, currencyInfo: 5, accountInfo: '33333', invoiceInfo: 0, modifyName: 1, modifyTime: 1, payType: 1, settStatusInfo: 40, settlementMoney: 1, storeName: 1 },

      ],
      page: {
        total: 0,
        current: +params.page || 1,
        pageSize: 10
      },
      visible: false,
      operateType: 'submit'
    }
  }
  state = {

  };
  componentDidMount() {
    // this.fetchData()
  }
  componentDidUpdate(prevProps) {
    if (this.props.status !== prevProps.status) {

      const options = {
        status: this.props.status,
        pageSize: this.state.page.pageSize,
        page: 1
      };
      this.fetchData(options);
    }
  }
  // 列表数据
  fetchData(params = {}) {
    const { status } = this.props;
    const { page } = this.state;
    const options = {
      status,
      pageSize: page.pageSize,
      page: page.current,
      ...params
    };
    api.fetchCheckingList(options).then((res = {}) => {
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
    const { status } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        console.log(vals)
        const params = {
          ...vals,
          createStartTime: vals.createTime && vals.createTime[0] && +new Date(vals.createTime[0]),
          createEndTime: vals.createTime && vals.createTime[1] && +new Date(vals.createTime[1]),
          modifyStartTime: vals.modifyTime && vals.modifyTime[0] && +new Date(vals.modifyTime[0]),
          modifyEndTime: vals.modifyTime && vals.modifyTime[1] && +new Date(vals.modifyTime[1]),
          page: 1,
          pageSize: 10,
          status
        };
        delete params.createTime;
        delete params.modifyTime;
        this.fetchData(params);
      }
    });
  };

  // 取消搜索
  handleClear = () => {
    const { form: { setFieldsValue } } = this.props;
    const { page } = this.state;
    setQuery({ page: page.current, pageSize: page.pageSize }, true);
    setFieldsValue({
      createName: '',
      createTime: '',
      id: '',
      invoiceInfo: '',
      modifyName: '',
      modifyTime: [],
      storeName: ''
    })
    this.fetchData(parseQuery());
  }


  // 驳回|提交结算|去付款按钮
  handleBtnAction = (id, operateType) => () => {
    if (operateType !== 'topay') {
      this.setState({
        visible: true,
        operateType
      })
    } else {
      // api.settlementPay(id)
    }

  };
  // 驳回|提交结算 确定后回调
  handleSucc = () => {
    this.setState({
      visible: false
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  };
  // 导出
  exportFile = () => {
    
  }
  /**
 * 选择项发生变化时的回调
 */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows
    });
  };

  render() {
    const { page, dataSource, selectedRowKeys, operateType } = this.state;

    const {
      form: { getFieldDecorator }
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const columns = [
      {
        title: '结算单ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '本期结算对账单金额',
        dataIndex: 'settlementMoney',
        key: 'settlementMoney'
      },
      {
        title: '供应商',
        dataIndex: 'storeName',
        key: 'storeName'
      },
      {
        title: '结算方式',
        dataIndex: 'payType',
        key: 'payType'
      },
      {
        title: '收款账户',
        dataIndex: 'accountInfo',
        key: 'accountInfo'
      },
      {
        title: '币种',
        dataIndex: 'currencyInfo',
        key: 'currencyInfo'
      },
      {
        title: '发票',
        dataIndex: 'invoiceInfo',
        key: 'invoiceInfo',
        render: record => record === 1 ? '有' : '无'
      },
      {
        title: '状态',
        dataIndex: 'settStatusInfo',
        key: 'settStatusInfo',
        render: value => TextMapSettleStatus[value]
      },
      {
        title: '创建人',
        dataIndex: 'createName',
        key: 'createName'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },
      {
        title: '操作人',
        dataIndex: 'modifyName',
        key: 'modifyName'
      },
      {
        title: '操作时间',
        dataIndex: 'modifyTime',
        key: 'modifyTime'
      },
      {
        title: '操作',
        align: 'center',
        width: '200px',
        render: (operate, { settStatusInfo, id }) => (
          <>
            <div>
              {
                settStatusInfo === enumSettleType.ToBeSettled ?
                  <>
                    <Button type="primary" onClick={this.handleBtnAction(id, 'submit')} >提交结算</Button>
                    <Divider type="vertical" />
                    <Button type="primary" onClick={this.handleBtnAction(id, 'reject')} >驳回 </Button>
                  </>
                  : settStatusInfo === enumSettleType.Settling ?
                    <>
                      <Button type="primary" onClick={this.handleBtnAction(id, 'topay')} >去付款</Button>
                      <Divider type="vertical" />
                      <Button type="primary" onClick={this.handleBtnAction(id, 'reject')} >驳回 </Button>
                    </>
                    : settStatusInfo === enumSettleType.Abnormal ?
                      <Button type="primary" onClick={this.handleBtnAction(id, 'topay')} >去付款</Button>
                      : null
              }
            </div>
            <div>
              <Button type="link" >

                <Link to={`/merchant-accounts/settlement/detail/${id}`}>查看明细</Link>
              </Button>
              <Divider type="vertical" />
              <Button type="link" onClick={this.exportFile} >导出</Button>
            </div>
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
                  {getFieldDecorator('anchorId', { initialValue: '' })(
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
                <FormItem label="操作人">
                  {getFieldDecorator('modifyName', { initialValue: '' })(
                    <Input placeholder="请输入操作人" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="发票">
                  {getFieldDecorator('invoiceInfo', { initialValue: '' })(
                    <Select allowClear placeholder='请选择订单类型'>
                      <Select.Option key="" value="">全部</Select.Option>
                      <Select.Option key="0" value="0">有</Select.Option>
                      <Select.Option key="1" value="1">无</Select.Option>
                    </Select>
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
                <Button type="default" onClick={this.handleClear}>取消</Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card style={{ marginTop: 10 }}>
          {dataSource && dataSource.length > 0 ? (
            <Table
              rowSelection={rowSelection}
              bordered
              columns={columns}
              dataSource={dataSource}
              pagination={page}
              onChange={this.handleChangeTable}
              defaultExpandAllRows={true}
              rowKey={record => record.id}
            />
          ) : (
              '暂无数据'
            )}
        </Card>
        {/* 提交|驳回提示框 */}
        <SettleModal operateType={operateType} handleSucc={this.handleSucc} modalProps={{ visible: this.state.visible, onCancel: this.handleCancel }} />
      </Spin>
    )
  }
}
export default Form.create()(List);