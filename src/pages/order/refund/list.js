import React from 'react';
import { Card, Form, Input, Button, message, Select, DatePicker, Spin } from 'antd';
import moment from 'moment';
import { enumRefundStatus, refundType } from '../constant';
import { refundList, exportRefund } from '../api';
import GoodCell from '../../../components/good-cell';
import SuppilerSelect from '../../../components/suppiler-select';
import RemarkModal from '../components/remark-modal';
import RefundModal from '../components/refund-modal';
import { formatMoneyWithSign } from '@/pages/helper';
import { dateFormat } from '@/util/utils';
import CommonTable from '@/components/common-table';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

class OrderList extends React.Component {
  static defaultProps = {};

  state = {
    selectedRowKeys: [],
    list: [],
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    tableConfig: {},
  };

  componentDidMount() {
    this.query();
  }

  query = (isExport = false) => {
    let fieldsValues = this.props.form.getFieldsValue();
    let rangePickerValue = fieldsValues['rangePicker']
    delete fieldsValues['rangePicker'];
    let params = {
      ...fieldsValues,
      applyStartTime: rangePickerValue && rangePickerValue[0] && rangePickerValue[0].format('YYYY-MM-DD HH:mm'),
      applyEndTime: rangePickerValue && rangePickerValue[1] && rangePickerValue[1].format('YYYY-MM-DD HH:mm'),
      refundStatus: this.props.refundStatus,
      page: this.state.current,
      pageSize: this.state.pageSize,
    };
    if (isExport) {
      this.setState({
        loading: true
      })
      exportRefund(params).then((res) => {
        res && message.success('导出成功');
      }).finally(() =>{
        this.setState({
          loading: false
        })
      })
    } else {
      refundList(params).then(res => {
        this.setState({
          tableConfig: res.data || {}
        });
      });
    }
  };

  handleSearch = () => {
    this.query();
  };

  export = () => {
    this.query(true);
  };

  reset = () => {
    this.props.form.resetFields();
  };

  handlePageChange = (pagination) => {
    this.setState(
      {
        current: pagination.page,
        pageSize: pagination.pageSize,
      },
      this.query,
    );
  };
  render() {
    const { tableConfig: { records = [], total = 0, current = 0  } } = this.state;
    const {
      // refundStatus,
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'skuName',
        render(skuName, row) {
          return <GoodCell {...row} />;
        },
      },
      {
        title: '商品单价',
        dataIndex: 'salePrice',
        render(salePrice) {
          return salePrice ? formatMoneyWithSign(salePrice) : '';
        },
      },
      {
        title: '商品数量',
        dataIndex: 'num',
      },
      {
        title: '售后单编号',
        dataIndex: 'orderCode',
      },
      {
        title: '订单编号',
        dataIndex: 'mainOrderCode',
      },
      {
        title: '供应商',
        dataIndex: 'storeName',
      },
      {
        title: '买家 (手机号)',
        dataIndex: 'userName',
        render(v, record) {
          return `${v ? v : ''} ${record.phone ? `(${record.phone})` : ''}`
        }
      },
      {
        title: '类型',
        dataIndex: 'refundTypeStr',
      },
      {
        title: '退款状态',
        dataIndex: 'refundStatusStr',
      },
      {
        title: '实付金额（元）',
        dataIndex: 'buyPrice',
        render(v) {
          return v ? formatMoneyWithSign(v) : ''
        }
      },
      {
        title: '售后时间',
        dataIndex: 'createTime',
        render(v) {
          return v && moment(v).format(dateFormat)
        }
      },
      {
        title: '操作',
        dataIndex: 'record',
        render: (_, { id, skuId, refundId, childOrderId, mainOrderCode, orderCode, refundStatus, isDelete }) => {
          return (
            <div style={{ display: 'flex' }}>
              <RemarkModal
                onSuccess={this.query}
                orderCode={mainOrderCode}
                refundId={refundId}
                childOrderId={childOrderId}
              />
              &nbsp;
              {[enumRefundStatus.Complete, enumRefundStatus.Rejected].includes( // 已完成，已取消（isDelete === 1），已驳回的展示查看
                  Number(refundStatus)
                ) || isDelete === 1 ? (
                    <RefundModal
                    onSuccess={this.query}
                    orderCode={orderCode}
                    refundId={refundId}
                    childOrderId={childOrderId}
                    skuId={skuId}
                    id={id}
                    readOnly={true}
                  />
              ) : <RefundModal
                    onSuccess={this.query}
                    orderCode={orderCode}
                    refundId={refundId}
                    childOrderId={childOrderId}
                    skuId={skuId}
                    id={id}
                  />}
            </div>
          );
        },
      },
    ];

    return (
      <Spin tip="操作处理中..." spinning={this.state.loading}>
        <Form layout="inline" style={{ marginBottom: 20 }}>
          <FormItem label="订单编号">
            {getFieldDecorator('mainOrderCode')(<Input placeholder="请输入订单编号" />)}
          </FormItem>
          <FormItem label="售后单编号">
            {getFieldDecorator('orderCode')(<Input placeholder="请输入售后单编号" />)}
          </FormItem>
          <FormItem label="收货人">
            {getFieldDecorator('consignee')(<Input placeholder="" />)}
          </FormItem>
          {/* <FormItem label="快递单号">
            {getFieldDecorator('expressCode')(<Input placeholder="" />)}
          </FormItem> */}
          <FormItem label="售后类型">
            {getFieldDecorator('refundType', {
              initialValue: ''
            })(
              <Select style={{ width: 150 }}>
                {
                  refundType.map(item => (<Option key={item.value} value={item.value}>{item.label}</Option>))
                }
              </Select>
            )}
          </FormItem>
          <FormItem label="商品ID">
            {getFieldDecorator('productId')(<Input placeholder="" />)}
          </FormItem>
          <FormItem label="收货人电话">
            {getFieldDecorator('phone')(<Input placeholder="" />)}
          </FormItem>
          <FormItem label="供应商">
            {getFieldDecorator('storeId', {})(<SuppilerSelect />)}
          </FormItem>
          <FormItem label="售后时间">
            {getFieldDecorator('rangePicker', {})(<RangePicker format="YYYY-MM-DD HH:mm" showTime />)}
          </FormItem>
          <FormItem>
            <Button type="default" onClick={this.reset}>
              清除条件
            </Button>
            <Button type="primary" style={{ margin: '0 10px' }} onClick={this.handleSearch}>
              查询订单
            </Button>
            <Button type="primary" onClick={this.export}>
              导出订单
            </Button>
          </FormItem>
        </Form>
        <CommonTable
          bordered
          columns={columns}
          dataSource={records}
          current={current}
          total={total}
          onChange={this.handlePageChange}
          rowKey={record => record.id}
          scroll={{ x: 1.5 }}
        />
      </Spin>
    );
  }
}

export default Form.create()(OrderList);
