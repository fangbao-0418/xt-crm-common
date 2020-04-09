import React from 'react';
import moment from 'moment';
import { Table, Card, Form, Input, Button, DatePicker, Spin, Row, Col, Select } from 'antd';
import SettleModal from './components/settleModal'
import RejectModal from './components/rejectModal'
import getColumns from './config/columns'
import { setQuery, parseQuery, gotoPage } from '@/util/utils';
import * as api from '../api'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class List extends React.Component {
  constructor(props) {
    super(props)
    const params = parseQuery();
    this.state = {
      dataSource: [], // table列表数据
      page: { // table 分页
        total: 0,
        current: +params.page || 1,
        pageSize: 10
      },
      settleModalVisible: false, // 结算模态框
      rejectModalVisible: false, // 驳回模态框
      selectId: '' // 当前选中条目
    }
  }
  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    if (this.props.settStatus !== prevProps.settStatus) {
      const { page } = this.state
      page.current = 1;
      this.fetchData();
    }
  }
  // 列表数据
  fetchData(params = {}) {
    const { settStatus } = this.props;
    const { page } = this.state;
    const options = {
      settStatus,
      pageSize: page.pageSize,
      page: page.current,
      ...params
    };
    api.getSettlementList(options).then((res = {}) => {
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
        };
        delete params.createTime;
        delete params.modifyTime;
        this.fetchData(params);
      }
    });
  };

  // 重置条件
  handleClear = () => {
    const { form: { setFieldsValue } } = this.props;
    const { page } = this.state;
    setFieldsValue({
      createName: '',
      createTime: '',
      serialNo: '',
      isInvoice: '',
      modifyName: '',
      modifyTime: '',
      storeName: '',
      storeType: ''
    })
    page.current = 1
    setQuery({ page: page.current, pageSize: page.pageSize }, true);
    this.fetchData();
  }

  // 结算
  handleSettle = (selectId) => () => {
    this.setState({
      selectId,
      settleModalVisible: true,
    })
  }

  // 驳回
  handleReject = (selectId) => () => {
    this.setState({
      selectId,
      rejectModalVisible: true,
    })
  }

  // 支付
  handlePay = (id, serialNo) => () => {
    api.settlementPay(id).then(res => {
      res && gotoPage('/merchant-accounts/payment?settlementSerialNo=' + serialNo)
    })
  }

  // 结算|驳回 确认回调
  handleSucc = (key) => {
    this.setState({
      [key]: false
    })
    // 刷新
    this.fetchData(parseQuery());
  }

  // 模态框取消操作
  handleCancel = (key) => {
    this.setState({
      [key]: false
    })
  }

  render() {
    const { page, dataSource, selectId, settleModalVisible, rejectModalVisible } = this.state;
    const {
      form: { getFieldDecorator }
    } = this.props;

    const columns = getColumns({
      onSettle: this.handleSettle,
      onReject: this.handleReject,
      onPay: this.handlePay
    });

    return (
      <Spin tip="操作处理中..." spinning={false}>
        <Card title="筛选">
          <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Row gutter={24}>
              <Col span={6}>
                <FormItem label="结算单ID">
                  {getFieldDecorator('serialNo', { initialValue: '' })(
                    <Input placeholder="请输入结算单ID" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="商家名称">
                  {getFieldDecorator('storeName', { initialValue: '' })(
                    <Input placeholder="请输入商家名称" />
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
                <FormItem label="商家类型">
                  {getFieldDecorator('storeType', { initialValue: '' })(
                    <Select>
                      <Select.Option value="">全部</Select.Option>
                      <Select.Option value="1">供应商</Select.Option>
                      <Select.Option value="2">小店</Select.Option>
                      <Select.Option value="3">买菜供应商</Select.Option>
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
                <FormItem label="操作人">
                  {getFieldDecorator('modifyName', { initialValue: '' })(
                    <Input placeholder="请输入操作人" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="发票">
                  {getFieldDecorator('isInvoice', { initialValue: '' })(
                    <Select allowClear placeholder='请选择订单类型'>
                      <Select.Option key="" value="">全部</Select.Option>
                      <Select.Option key="0" value="1">有</Select.Option>
                      <Select.Option key="1" value="0">无</Select.Option>
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
                <Button type="default" onClick={this.handleClear}>清除</Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Table
            scroll={{
              x: columns.map((item) => Number(item.width || 0)).reduce((a, b) => {
                return a + b
              })
            }}
            bordered
            columns={columns}
            dataSource={dataSource}
            pagination={page}
            onChange={this.handleChangeTable}
            defaultExpandAllRows={true}
            rowKey={record => record.id}
          />
        </Card>
        {/* 结算提示框 */}
        <SettleModal
          id={selectId}
          handleSucc={this.handleSucc.bind(this, 'settleModalVisible')}
          modalProps={{
            visible: settleModalVisible,
            onCancel: this.handleCancel.bind(this, 'settleModalVisible')
          }}
        />
        {/* 驳回提示框 */}
        <RejectModal
          id={selectId}
          handleSucc={this.handleSucc.bind(this, 'rejectModalVisible')}
          modalProps={{
            visible: rejectModalVisible,
            onCancel: this.handleCancel.bind(this, 'rejectModalVisible')
          }}
        />
      </Spin>
    )
  }
}
export default Form.create()(List);