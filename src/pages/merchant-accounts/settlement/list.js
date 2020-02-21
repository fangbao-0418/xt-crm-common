import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Table, Card, Form, Input, Button, DatePicker, Spin, Row, Col, Select } from 'antd';
import SettleModal from './settleModal'
import MoneyRender from '@/components/money-render'
import { enumSettleType } from '../constant'
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
      modalVisible: false, // modal弹框隐藏显示
      operateType: 'submit', // modal操作类型
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
      storeName: ''
    })
    page.current = 1
    setQuery({ page: page.current, pageSize: page.pageSize }, true);
    this.fetchData();
  }


  // 驳回|提交结算|去付款按钮
  handleBtnAction = (id, operateType, serialNo) => () => {
    if (operateType !== 'topay') {
      this.setState({
        selectId: id,
        modalVisible: true,
        operateType
      })
    } else {
      api.settlementPay(id).then(res => {
        res && gotoPage('/merchant-accounts/payment?settlementSerialNo=' + serialNo)
      })
    }

  };
  // 驳回|提交结算 确定后回调
  handleSucc = () => {
    this.setState({
      modalVisible: false
    })
    // 刷新
    this.fetchData(parseQuery());
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false
    })
  };


  render() {
    const { page, dataSource, operateType, selectId, modalVisible } = this.state;
    const {
      form: { getFieldDecorator }
    } = this.props;
    const columns = [
      {
        title: '结算单ID',
        dataIndex: 'serialNo',
        key: 'serialNo',
        width: 150
      },
      {
        title: '本期结算对账单金额',
        dataIndex: 'settlementMoney',
        key: 'settlementMoney',
        render: MoneyRender,
        width: 150

      },
      {
        title: '供应商',
        dataIndex: 'storeName',
        key: 'storeName',
        width: 150

      },
      {
        title: '结算方式',
        dataIndex: 'payType',
        key: 'payType',
        width: 150

      },
      {
        title: '收款账户',
        dataIndex: 'accountInfo',
        key: 'accountInfo',
        width: 150

      },
      {
        title: '币种',
        dataIndex: 'currencyInfo',
        key: 'currencyInfo',
        width: 150

      },
      {
        title: '发票',
        dataIndex: 'invoiceInfo',
        width: 150

      },
      {
        title: '状态',
        dataIndex: 'settStatusInfo',
        key: 'settStatusInfo',
        width: 150
      },
      {
        title: '创建人',
        dataIndex: 'createName',
        key: 'createName',
        width: 150

      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,

        render: (createTime) => {
          return APP.fn.formatDate(createTime)
        }
      },
      {
        title: '操作人',
        dataIndex: 'modifyName',
        key: 'modifyName',
        width: 150

      },
      {
        title: '操作时间',
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        width: 200,

        render: (modifyTime) => {
          return APP.fn.formatDate(modifyTime)
        }
      },
      {
        title: '操作',
        align: 'center',
        width: 200,
        render: (operate, { settStatus, id, serialNo }) => (
          <>

            {
              settStatus === enumSettleType.ToBeSettled ?
                <>
                  <Button type="link" onClick={this.handleBtnAction(id, 'submit')} style={{ padding: '0 3px' }}>提交结算</Button>
                  <Button type="link" onClick={this.handleBtnAction(id, 'reject')} style={{ padding: '0 3px' }}>驳回 </Button>
                </>
                : settStatus === enumSettleType.Settling ?
                  <>
                    <Button type="link" onClick={this.handleBtnAction(id, 'topay', serialNo)} style={{ padding: '0 3px' }}>去付款</Button>
                    <Button type="link" onClick={this.handleBtnAction(id, 'reject')} style={{ padding: '0 3px' }}>驳回 </Button>
                  </>
                  : settStatus === enumSettleType.partSettled ?
                    <Button type="link" onClick={this.handleBtnAction(id, 'topay', serialNo)} style={{ padding: '0 3px' }}>去付款</Button>
                    : null
            }
            <Button type="link" style={{ padding: '0 2px' }}>
              <Link to={`/merchant-accounts/settlement/${id}`}>查看明细</Link>
            </Button>
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
                  {getFieldDecorator('serialNo', { initialValue: '' })(
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
          {dataSource && dataSource.length > 0 ? (
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
          ) : (
              '暂无数据'
            )}
        </Card>
        {/* 提交|驳回提示框 */}
        <SettleModal id={selectId} operateType={operateType} handleSucc={this.handleSucc} modalProps={{ visible: modalVisible, onCancel: this.handleCancel }} />
      </Spin>
    )
  }
}
export default Form.create()(List);