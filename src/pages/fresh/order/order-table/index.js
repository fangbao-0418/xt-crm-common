import React, { useState } from 'react'
import { Table, Card, Form, Input, Button, message, DatePicker, Spin, Row, Col } from 'antd'
import { isNil } from 'lodash'
import moment from 'moment'
import { OrderStatusTextMap } from '../constant'
import { formatDate, formatMoneyWithSign } from '@/pages/helper'
import { getOrderList } from '../api'
import GoodCell from '@/components/good-cell'
import SuppilerSelect from '@/components/suppiler-auto-select'
import RemarkModal from '../components/modal/remark-modal'
// import RefundModal from '../components/refund-modal';
// import RefundStatusCell from '../components/refund-status-cell';
import { parseQuery } from '@/util/utils'
import SelectOrderType from './SelectOrderType'
import withModal from './withModal'
const { RangePicker } = DatePicker
const FormItem = Form.Item

const formatRangeDate = (val) => {
  return Array.isArray(val) ? val.map(v => v.format('YYYY-MM-DD HH:mm')) : []
}
@withModal
class OrderList extends React.Component {
  static defaultProps = {};
  payload = APP.fn.getPayload('order') || {};
  state = {
    selectedRowKeys: [],
    list: [],
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false
  };

  componentDidMount () {
    // this.query();
  }

  query = (isExport = false, noFetch = false) => {
    const { intercept } = this.props
    const obj = parseQuery()
    const fieldsValues = this.props.form.getFieldsValue()
    const rangePickerValue = fieldsValues['rangePicker']
    if (this.props.type === 'refund') {
      const [skuServerStartDate, skuServerEndDate] = formatRangeDate(rangePickerValue)
      fieldsValues.skuServerStartDate = skuServerStartDate
      fieldsValues.skuServerEndDate = skuServerEndDate
    }
    if (this.props.type === 'order') {
      const [orderStartDate, orderEndDate] = formatRangeDate(rangePickerValue)
      fieldsValues.orderStartDate = orderStartDate
      fieldsValues.orderEndDate = orderEndDate
    }
    if (intercept) {
      fieldsValues['interceptorFlag'] = 1
      fieldsValues['interceptorPhone'] = obj.iphone
    }
    const playPickerValue = fieldsValues['playPicker']
    const [payStartDate, payEndDate] = formatRangeDate(playPickerValue)
    fieldsValues.payStartDate = payStartDate
    fieldsValues.payEndDate = payEndDate
    delete fieldsValues['playPicker']
    delete fieldsValues['rangePicker']
    const params = {
      ...fieldsValues,
      orderStatus: this.props.orderStatus,
      refundStatus: this.props.refundStatus,
      page: this.state.current,
      pageSize: this.state.pageSize
    }
    this.payload = this.payload || {}
    this.payload[this.props.pathname] = params
    APP.fn.setPayload('order', this.payload)
    if (noFetch) {
      return
    }
    getOrderList(params).then((res = {}) => {
      this.setState({
        list: res.records,
        total: res.total
      })
    })
  };

  handleSearch = () => {
    this.setState(
      {
        current: 1
      },
      () => {
        this.query()
      }
    )
  };

  handleImportChange = info => {
    const { status, response, name } = info.file
    if (status === 'done') {
      if (response.success) {
        message.success(`${name} 文件上传成功`)
      } else {
        message.error(`${response.message}`)
      }
    } else if (status === 'error') {
      message.error(`${name} 文件上传错误.`)
    }
  }

  reset = () => {
    this.props.form.resetFields()
    this.payload[this.props.pathname] = {}
    APP.fn.setPayload('order', this.payload)
    this.setState({}, () => {
      console.log(this.props.form.getFieldsValue(), 'getFieldsValue')
      this.query()
    })
  };

  onSelectChange = selectedRowKeys => {
    const { setSelectedRowKeys } = useState([])
    setSelectedRowKeys(selectedRowKeys)
  };

  handlePageChange = (page, pageSize) => {
    this.setState(
      {
        current: page,
        pageSize
      },
      this.query
    )
  };
  render () {
    const { total, pageSize, current, list } = this.state
    const {
      refundStatus,
      form: { getFieldDecorator }
    } = this.props
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderCode',
        width: '400px',
        render: (operate, { orderStatus, orderCode }) => (
          <Button type='link' href={window.location.pathname + `#/fresh/order/detail/${orderCode}`} target='_blank'>
            {orderCode}
          </Button>
        )
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        width: '300px',
        render: (createTime, row) => <div>下单时间：{formatDate(createTime)}</div>
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        render (orderStatus) {
          return <div>{OrderStatusTextMap[orderStatus]}</div>
        }
      },
      {
        title: '实付金额',
        dataIndex: 'totalMoney',
        render (totalMoney, { freight }) {
          return (
            <div>
              {formatMoneyWithSign(totalMoney)}
              <div>（含运费：{formatMoneyWithSign(freight)}）</div>
            </div>
          )
        }
      },
      {
        title: '收货人',
        dataIndex: 'consignee',
        render (consignee, { phone, remark }) {
          return (
            <div>
              <div>{consignee}</div>
              <div>{phone}</div>
              <div>{remark}</div>
            </div>
          )
        }
      },

      {
        title: '操作',
        hide: !isNil(refundStatus),
        width: '150px',
        render: (operate, { orderType, orderStatus, orderCode }) => (
          <>
            <Button type='link' href={window.location.pathname + `#/fresh/order/detail/${orderCode}`} target='_blank'>
              查看详情
            </Button>
          </>
        )
      }
    ].filter(column => !column.hide)

    const expandedRowRender = row => {
      const columns = [
        {
          title: '商品名称',
          dataIndex: 'skuName',
          width: '400px',
          render (skuName, row) {
            return <GoodCell {...row} />
          }
        },
        {
          title: '商品单价',
          dataIndex: 'salePrice',
          width: '300px',
          render (salePrice) {
            return formatMoneyWithSign(salePrice)
          }
        },
        {
          title: '购买价',
          dataIndex: 'buyPrice',
          key: 'buyPrice',
          render (buyPrice) {
            return formatMoneyWithSign(buyPrice)
          }
        },
        {
          title: '商品数量',
          dataIndex: 'num',
          key: 'num'
        },
        {
          title: '售后状态',
          dataIndex: 'refundStatus',
          hide: isNil(refundStatus)
          // render(refundStatus, row) {
          //   return <RefundStatusCell refundStatus={refundStatus} />;
          // }
        },
        {
          title: '操作',
          dataIndex: 'record',
          width: '150px',
          render: (record, { skuId, refundId, childOrderId }) => (
            <>
              <RemarkModal
                onSuccess={this.query}
                orderCode={row.orderCode}
                refundId={refundId}
                childOrderId={childOrderId}
              />
              &nbsp;
              {/* {[enumRefundStatus.Operating, enumRefundStatus.WaitConfirm].indexOf(Number(refundStatus)) > -1 && (
                <RefundModal
                  onSuccess={this.query}
                  orderCode={row.orderCode}
                  refundId={refundId}
                  childOrderId={childOrderId}
                  skuId={skuId}
                />
              )} */}
            </>
          )
        }
      ].filter(column => !column.hide)
      return (
        <Table
          columns={columns}
          dataSource={row.skuList}
          pagination={false}
          defaultExpandAllRows
          rowKey={record => record.skuId}
        />
      )
    }
    const values = this.payload[this.props.pathname] || {}
    values.rangePicker = values.orderStartDate && [moment(values.orderStartDate), moment(values.orderEndDate)]
    values.playPicker = values.payStartDate && [moment(values.payStartDate), moment(values.payEndDate)]
    return (
      <Spin tip='操作处理中...' spinning={false}>
        <Card title='筛选'>
          <Form labelCol = {{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Row gutter={24}>
              <Col span={6}>
                <FormItem label='订单编号'>
                  {getFieldDecorator('orderCode', { initialValue: values.orderCode })(
                    <Input placeholder='请输入订单编号' />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label='订单类型'>
                  {getFieldDecorator('queryOrderType', {
                    initialValue: values.queryOrderType
                  })(<SelectOrderType />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label='商品ID'>
                  {getFieldDecorator('productId', { initialValue: values.productId })(
                    <Input type='number' placeholder='请输入商品ID' />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label='下单人ID'>
                  {getFieldDecorator('buyerId', { initialValue: values.buyerId })(
                    <Input placeholder='请输入下单人ID' />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label='下单人电话'>
                  {getFieldDecorator('buyerPhone', { initialValue: values.buyerPhone })(
                    <Input placeholder='请输入下单人电话' />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label='收货人'>
                  {getFieldDecorator('contact', { initialValue: values.contact })(<Input placeholder='请输入收货人' />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label='收货人电话'>
                  {getFieldDecorator('phone')(<Input placeholder='请输入收货人电话' />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label='供应商'>
                  {getFieldDecorator('storeId', { initialValue: values.storeId })(<SuppilerSelect />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.props.type === 'order' ? '下单时间' : '售后时间'}>
                  {getFieldDecorator('rangePicker', { initialValue: values.rangePicker })(
                    <RangePicker
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD HH:mm'
                      showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                {
                  this.props.type === 'order'
                    ? <FormItem label='支付时间'>
                      {getFieldDecorator('playPicker', { initialValue: values.playPicker })(
                        <RangePicker
                          style={{ width: '100%' }}
                          format='YYYY-MM-DD HH:mm'
                          showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}
                        />
                      )}
                    </FormItem>
                    : ''
                }
              </Col>
              <Col span={6}>
                <FormItem label='店主手机'>
                  {getFieldDecorator('selfDeliveryPointPhone', { initialValue: values.selfDeliveryPointPhone })(
                    <Input placeholder='请输入店主手机' />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label='门店编号'>
                  {getFieldDecorator('selfDeliveryPointCode', { initialValue: values.selfDeliveryPointCode })(
                    <Input placeholder='请输入门店编号' />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label='门店单号'>
                  {getFieldDecorator('purchaseSentSn', { initialValue: values.purchaseSentSn })(
                    <Input placeholder='请输入门店单号' />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                {/* <Button type='link' onClick={this.props.modal}>批量查询物流轨迹</Button> */}
                <Button type='default' onClick={this.reset}>
                  清除条件
                </Button>
                <Button type='primary' style={{ margin: '0 10px' }} onClick={this.handleSearch}>
                  查询订单
                </Button>
              </Col>
            </Row>
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
                onChange: this.handlePageChange
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
    )
  }
}

export default Form.create()(OrderList)
