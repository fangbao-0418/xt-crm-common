// 手动发码
import React from 'react';
import { Card, Row, Button, Table, Modal, Select } from 'antd';
import Form, { FormItem } from '@/packages/common/components/form'
import { parseQuery } from '@/util/utils';
import { formatMoneyWithSign } from '../../helper';
import DateFns from 'date-fns';
import orderStatus from '@/enum/orderStatus';
import { fillChance } from './api';
import { getOrderList } from './../../order/api';
import './../activity.scss';
class Add extends React.Component {
  form = undefined
  state = {
    type: undefined
  }
  constructor(props) {
    super(props);
    const params = parseQuery();
    this.state = {
      visible: false,
      listData: [],
      current: 1,
      total: 0,
      pageSize: 8,
      initParams: params,
      selectedRows: [], // 选中行
      selectedRowKeys: []
    };
  }
  showModal = () => {
    console.log('show modal')
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    console.log(this.setState, 'consss')
    this.setState({
      visible: false,
      // selectedRows: [],
      // selectedRowKeys: [],
      // current: 1
    }, () => {
      console.log(this.state.visible, 'ccccccccc')
    });
  };
  handleReset = () => {
    this.form.reset()
    this.handleSearch()
  };
  handleSearch = () => {
    const values = this.form.getValues()
    const params = {
      ...values,
      page: this.state.current,
      pageSize: this.state.pageSize
    };
    getOrderList(params).then(res => {
      console.log('getOrderList', res);
      if (res && res.records) {
        this.setState({
          selectedRows: [],
          selectedRowKeys: [],
          listData: res.records,
          total: res.total
        });
      } else {
      }
    });
  };
  // 确定添加
  handleAdd = () => {
    console.log('确定添加', this.state.selectedRows);
    const orderIds =this.state.selectedRows.map((item) => item.id)
    // 添加手动发码
    fillChance({
      orderIds,
      type: this.state.type
    }).then(res => {
      if (res) {
        APP.success('发布成功');
        this.setState({
          visible: false,
          selectedRows: [],
          selectedRowKeys: []
        });
      } else {
        APP.error('发布失败');
      }
    });
  };
  handlePageChange = (page, pageSize) => {
    this.setState(
      {
        current: page,
        pageSize
      },
      this.handleSearch
    );
  }
  onChange = (type) => {
    this.setState({
      type
    })
  }
  render(h) {
    const { listData, total, pageSize, current } = this.state;

    const columns = [
      {
        title: '订单号码',
        dataIndex: 'orderCode'
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        render: text => <>{orderStatus.getValue(text)}</>
      },
      {
        title: '支付时间',
        dataIndex: 'payDate',
        render: text => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>
      },
      {
        title: '实付金额',
        dataIndex: 'totalMoney',
        render: text => <>{formatMoneyWithSign(text)}</>
      },
      {
        title: '下单人手机',
        dataIndex: 'buyerPhone'
      }
    ];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys
        });
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
    };

    const node = this.props.children || (
      <Button type="primary">
        手动发码
      </Button>
    )
    console.log(this.state.visible, 'node')
    return (
      <>
        <span
          onClick={this.showModal}
        >
          {node}
        </span>
        <Modal
          title="手动发码"
          className="modalStyle"
          width={1000}
          visible={this.state.visible}
          footer={
            <>
              <div style={{ textAlign: 'right' }}>
                <Button onClick={this.handleCancel.bind(this)}>取消</Button>
                <Button
                  type="primary"
                  disabled={!this.state.selectedRows.length}
                  onClick={this.handleAdd}
                  style={{ marginLeft: 30 }}
                >
                  确定
                </Button>
              </div>
            </>
          }
          onCancel={this.handleCancel.bind(this)}
        >
          <Card>
            <Form
              getInstance={(ref) => {
                this.form = ref
              }}
              layout='inline'
              rangeMap={{
                payTime: {
                  fields: ['payStartDate', 'payEndDate']
                }
              }}
            >
              <FormItem
                label='主订单号'
                name='orderCode'
                placeholder='请输入主订单号编号'
              />
              <FormItem
                label='下单手机号'
                name='buyerPhone'
                placeholder='请输入下单手机号'
              />
              <FormItem
                label='订单时间范围'
                name='payTime'
                type='rangepicker'
                controlProps={{
                  showTime: true
                }}
              />
              <FormItem>
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState(
                      {
                        current: 1
                      },
                      this.handleSearch
                    );
                  }}
                >
                  查询
                </Button>
                <Button type="primary" onClick={this.handleReset} style={{ marginLeft: 20 }}>
                  重置
                </Button>
              </FormItem>
            </Form>
          </Card>
          {/* <div>只可以查询10月25日-11月11日的订单 </div> */}
          <Card>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={listData}
              pagination={{
                current,
                total,
                pageSize,
                onChange: this.handlePageChange
              }}
            />
          </Card>
          <Row
            style={{
              textAlign: 'right',
              marginBottom: 10
            }}
          >
            <Select
              allowClear
              placeholder='请选择抽奖类型'
              style={{ width: 172 }}
              value={this.state.type}
              onChange={this.onChange}
            >
              <Select.Option value={2}>九宫格抽奖</Select.Option>
              <Select.Option value={3}>砸金蛋</Select.Option>
            </Select>
          </Row>
        </Modal>
      </>
    );
  }
}
export default Add;
