import React, { useState } from 'react';
import { Table, Card, Form, Input, Button, Divider, message, Upload, DatePicker, Spin } from 'antd';
import { isNil } from 'lodash';
import { OrderStatusTextMap, enumOrderStatus, enumRefundStatus } from '../constant';
import { formatDate, formatMoneyWithSign } from '../../helper';
import { getOrderList, exportOrder, importLogistics } from '../api';
import GoodCell from '../../../components/good-cell';
import SuppilerSelect from '@/components/suppiler-auto-select'
import RefundCell from '../components/refund-cell';
import RemarkModal from '../components/modal/remark-modal';
import RefundModal from '../components/refund-modal';
import RefundStatusCell from '../components/refund-status-cell';
import { getHeaders } from '@/util/utils';
import moment from 'moment';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const formatRangeDate = (val) => {
  return Array.isArray(val) ? val.map(v => v.format('YYYY-MM-DD HH:mm')) : []
}
class OrderList extends React.Component {
  static defaultProps = {};

  state = {
    selectedRowKeys: [],
    list: [],
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false
  };

  componentDidMount() {
    // this.query();
  }

  query = (isExport = false) => {
    let fieldsValues = this.props.form.getFieldsValue();
    let rangePickerValue = fieldsValues['rangePicker']
    if (this.props.type === 'refund') {
      const [skuServerStartDate, skuServerEndDate] = formatRangeDate(rangePickerValue)
      fieldsValues.skuServerStartDate = skuServerStartDate;
      fieldsValues.skuServerEndDate = skuServerEndDate;
    }
    if (this.props.type === 'order') {
      const [orderStartDate, orderEndDate] = formatRangeDate(rangePickerValue)
      fieldsValues.orderStartDate = orderStartDate;
      fieldsValues.orderEndDate = orderEndDate;
    }
    let playPickerValue = fieldsValues['playPicker'];
    const [payStartDate, payEndDate] = formatRangeDate(playPickerValue)
    fieldsValues.payStartDate = payStartDate;
    fieldsValues.payEndDate = payEndDate;
    delete fieldsValues['playPicker'];
    delete fieldsValues['rangePicker'];
    let params = {
      ...fieldsValues,
      orderStatus: this.props.orderStatus,
      refundStatus: this.props.refundStatus,
      page: this.state.current,
      pageSize: this.state.pageSize,
    };
    if (isExport) {
      this.setState({
        loading: true
      })
      exportOrder(params).then((res) => {
        res && message.success('导出成功');
      }).finally(() => {
        this.setState({
          loading: false
        })
      })
    } else {
      getOrderList(params).then((res = {}) => {
        this.setState({
          list: res.records,
          total: res.total,
        });
      });
    }
  };

  handleSearch = () => {
    this.query();
  };

  handleImportChange = info => {
    const { status, response, name } = info.file;
    if (status === 'done') {
      if (response.success) {
        message.success(`${name} 文件上传成功`);
      } else {
        message.error(`${response.message}`);
      }
    } else if (status === 'error') {
      message.error(`${name} 文件上传错误.`);
    }
  };

  export = () => {
    this.query(true);
  };

  reset = () => {
    this.props.form.resetFields();
  };

  onSelectChange = selectedRowKeys => {
    const { setSelectedRowKeys } = useState([]);
    setSelectedRowKeys(selectedRowKeys);
  };

  handlePageChange = (page, pageSize) => {
    this.setState(
      {
        current: page,
        pageSize,
      },
      this.query,
    );
  };
  render() {
    const { total, pageSize, current, list } = this.state;
    const {
      refundStatus,
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderCode',
        render: (operate, { orderStatus, orderCode }) => (
          <Button type="link" href={`/#/order/detail/${orderCode}`} target="_blank">
            {orderCode}
          </Button>
        ),
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        render: (createTime, row) => <div>下单时间：{formatDate(createTime)}</div>,
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        render(orderStatus) {
          return <div>{OrderStatusTextMap[orderStatus]}</div>;
        },
      },
      {
        title: '实付金额',
        dataIndex: 'totalMoney',
        render(totalMoney, { freight }) {
          return (
            <div>
              {formatMoneyWithSign(totalMoney)}
              <div>（含运费：{formatMoneyWithSign(freight)}）</div>
            </div>
          );
        },
      },
      {
        title: '收货人',
        dataIndex: 'consignee',
        render(consignee, { phone, remark }) {
          return (
            <div>
              <div>{consignee}</div>
              <div>{phone}</div>
              <div>{remark}</div>
            </div>
          );
        },
      },

      {
        title: '操作',
        hide: !isNil(refundStatus),
        render: (operate, { orderStatus, orderCode }) => (
          <>
            <Button type="link" href={`/#/order/detail/${orderCode}`} target="_blank">
              查看详情
            </Button>
            <Divider type="vertical" />
            {orderStatus === enumOrderStatus.Undelivered && (
              <Button type="link" href={`/#/order/detail/${orderCode}`} target="_blank">
                发货
              </Button>
              // <DeliveryModal onSuccess={this.query} orderCode={orderCode} />
            )}
          </>
        ),
      },
    ].filter(column => !column.hide);

    const expandedRowRender = row => {
      const columns = [
        {
          title: '商品名称',
          dataIndex: 'skuName',
          key: 'skuName',
          render(skuName, row) {
            return <GoodCell {...row} />;
          },
        },
        {
          title: '商品单价',
          dataIndex: 'salePrice',
          key: 'salePrice',
          render(salePrice) {
            return formatMoneyWithSign(salePrice);
          },
        },
        {
          title: '购买价',
          dataIndex: 'buyPrice',
          key: 'buyPrice',
          render(buyPrice) {
            return formatMoneyWithSign(buyPrice);
          },
        },
        {
          title: '商品数量',
          dataIndex: 'num',
          key: 'num',
        },
        {
          title: '售后信息',
          dataIndex: 'info',
          hide: isNil(refundStatus),
          render(info, row) {
            return <RefundCell {...row} />;
          },
        },
        {
          title: '售后状态',
          dataIndex: 'refundStatus',
          hide: isNil(refundStatus),
          render(refundStatus, row) {
            return <RefundStatusCell refundStatus={refundStatus} />;
          },
        },
        {
          title: '操作',
          dataIndex: 'record',
          render: (record, { skuId, refundId, childOrderId }) => (
            <>
              <RemarkModal
                onSuccess={this.query}
                orderCode={row.orderCode}
                refundId={refundId}
                childOrderId={childOrderId}
              />
              &nbsp;
              {[enumRefundStatus.Operating, enumRefundStatus.WaitConfirm].indexOf(
                Number(refundStatus),
              ) > -1 && (
                  <RefundModal
                    onSuccess={this.query}
                    orderCode={row.orderCode}
                    refundId={refundId}
                    childOrderId={childOrderId}
                    skuId={skuId}
                  />
                )}
            </>
          ),
        },
      ].filter(column => !column.hide);
      return (
        <Table
          columns={columns}
          dataSource={row.skuList}
          pagination={false}
          defaultExpandAllRows
          rowKey={record => record.skuId}
        />
      );
    };

    return (
      <Spin tip="操作处理中..." spinning={this.state.loading}>
        <Card title="筛选">
          <Form layout="inline">
            <FormItem label="订单编号">
              {getFieldDecorator('orderCode')(<Input placeholder="请输入订单编号" />)}
            </FormItem>
            <FormItem label="快递单号">
              {getFieldDecorator('expressCode')(<Input placeholder="请输入快递单号" />)}
            </FormItem>
            <FormItem label="商品ID">
              {getFieldDecorator('productId')(<Input type='number' placeholder="请输入商品ID" />)}
            </FormItem>
            <FormItem label="下单人ID">
              {getFieldDecorator('buyerId')(<Input placeholder="请输入下单人ID" />)}
            </FormItem>
            <FormItem label="下单人电话">
              {getFieldDecorator('buyerPhone')(<Input placeholder="请输入下单人电话" />)}
            </FormItem>
            <FormItem label="收货人">
              {getFieldDecorator('contact')(<Input placeholder="请输入收货人" />)}
            </FormItem>
            <FormItem label="收货人电话">
              {getFieldDecorator('phone')(<Input placeholder="请输入收货人电话" />)}
            </FormItem>
            <FormItem label="供应商">
              {getFieldDecorator('storeId', {})(<SuppilerSelect style={{width: '174px'}}/>)}
            </FormItem>
            <FormItem label={this.props.type === 'order' ? '下单时间' : '售后时间'}>
              {getFieldDecorator('rangePicker', {})(<RangePicker format="YYYY-MM-DD HH:mm"  showTime={{defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}} />)}
            </FormItem>
            {this.props.type === 'order' ? <FormItem label="支付时间">
              {getFieldDecorator('playPicker', {})(<RangePicker format="YYYY-MM-DD HH:mm"  showTime={{defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}} />)}
            </FormItem> : ''}
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
              {this.props.orderStatus === enumOrderStatus.Undelivered && (
                <Upload
                  name="file"
                  accept=".xls,.xlsx"
                  showUploadList={false}
                  withCredentials={true}
                  action={importLogistics}
                  headers={getHeaders({})}
                  onChange={this.handleImportChange}
                  style={{ margin: '0 10px' }}
                >
                  <Button type="primary">导入物流单号</Button>
                </Upload>
              )}
            </FormItem>
          </Form>
        </Card>
        <Card style={{ marginTop: 10 }}>
          {list && list.length > 0 ? (
            <Table
              bordered
              columns={columns}
              dataSource={this.state.list}
              pagination={{
                current,
                total,
                pageSize,
                onChange: this.handlePageChange,
              }}
              defaultExpandAllRows={true}
              expandedRowRender={expandedRowRender}
              rowKey={record => record.orderCode}
            />
          ) : (
              '暂无数据'
            )}
        </Card>
      </Spin>
    );
  }
}

export default Form.create()(OrderList);
