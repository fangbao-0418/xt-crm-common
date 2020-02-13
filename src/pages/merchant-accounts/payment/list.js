import React, { useState } from 'react';
import moment from 'moment';
import { isNil } from 'lodash';
import { setQuery, parseQuery, gotoPage } from '@/util/utils';
import { Table, Card, Form, Input, Button,Divider, message, Upload, DatePicker, Spin, Row, Col, Select, Modal } from 'antd';
import PayModal from './payModal'
import { compose } from 'redux';
// import { getPayList } from '../api';
import {enumPayType, TextMapPayStatus} from '../constant'
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
      record: {}, 
      page: {
        total: 0,
        current: +params.page || 1,
        pageSize: 10
      },
      list: [
        {id: 'sssssvfg', createName:'水水水水水水水', createTime:1581404208893, modifyName:8000,modifyTime:1581404268893,paymentMoney:987,paymentName:'fgdh',paymentStatusInfo:10,settId:'ddddd',storeName:'vvvvv'},
        {id: 'aaaaaaaaaa', createName:'啦啦啦啦啦啦啦', createTime:1581404208893, modifyName:8000,modifyTime:1581404268893,paymentMoney:987,paymentName:'fgdh',paymentStatusInfo:20,settId:'ddddd',storeName:'vvvvv'},
        {id: 'bbbbbbbbbbb', createName:'烦烦烦烦烦烦烦烦烦', createTime:1581404208893, modifyName:8000,modifyTime:1581404268893,paymentMoney:987,paymentName:'fgdh',paymentStatusInfo:30,settId:'ddddd',storeName:'vvvvv'},
        {id: 'ccccccccc', createName:'踩踩踩踩踩踩踩踩踩', createTime:1581404208893, modifyName:8000,modifyTime:1581404268893,paymentMoney:987,paymentName:'fgdh',paymentStatusInfo:40,settId:'ddddd',storeName:'vvvvv'},
        {id: 'ddddddddd', createName:'顶顶顶顶顶顶顶顶', createTime:1581404208893, modifyName:8000,modifyTime:1581404268893,paymentMoney:987,paymentName:'fgdh',paymentStatusInfo:20,settId:'ddddd',storeName:'vvvvv'},
        {id: 'eeeeeeee', createName:'咩咩咩咩咩咩', createTime:1581404208893, modifyName:8000,modifyTime:1581404268893,paymentMoney:987,paymentName:'fgdh',paymentStatusInfo:10,settId:'ddddd',storeName:'vvvvv'},

      
      ],
      loading: false,
      visible: false,
      confirmLoading: false,
      modalTitle: '确认付款'
    };

  }

  componentDidMount() {
    const params = parseQuery();

    this.fetchData(params);
  }
  // 获取商品列表
  fetchData(params={}) {
    
  }
  handlePageChange = (page, pageSize) => {
    this.setState(
      {
        current: page,
        pageSize
      },
      this.query
    );
  };
  // 查询
  handleSearch = () => {
    const { validateFields } = this.props.form;
 
    // const { status } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        console.log(vals)
        const params = {
          ...vals,
          createStartTime: vals.goodsTime && vals.goodsTime[0] && +new Date(vals.goodsTime[0]),
          createEndTime: vals.goodsTime && vals.goodsTime[1] && +new Date(vals.goodsTime[1]),
          modifyStartTime: vals.optionTime && vals.optionTime[0] && +new Date(vals.optionTime[0]),
          modifyEndTime: vals.optionTime && vals.optionTime[1] && +new Date(vals.optionTime[1]),
          page: 1,
          pageSize: 10
        };
        delete params.goodsTime;
        delete params.optionTime;
        // 查询列表
        // this.fetchData(params);
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
  handleConfirm=(record, type) =>() => {
    // console.log(record)
    this.setState({
      visible: true,
      modalTitle: type === 'confirm' ? '确认付款':'查看明细',
      record
    })
  };
  handlePayConfirm=()=> {
    alert('确认支付确定')
  };
  handleRejectCancel=()=> {
    this.setState({
      visible: false
    })
  };
    /**
   * 选择项发生变化时的回调
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({
      selectedRowKeys,
      selectedRows
    });
  };
  query() {
    
  }
  render() {
    const { total, pageSize, current, list, selectedRowKeys, record } = this.state;

    const {
      form:{ getFieldDecorator }
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const columns = [
      {
        title: 'ID',
        key:'id',
        dataIndex: 'id',
      },
      {
        title: '付款单名称',
        key:'paymentName',
        dataIndex: 'paymentName',
      },
      {
        title: '结算ID',
        key:'settId',
        dataIndex: 'settId',
      
      },
      {
        title: '金额',
        key:'paymentMoney',
        dataIndex: 'paymentMoney',
      
      },
      {
        title: '供应商',
        key:'storeName',
        dataIndex: 'storeName',
       
      },
      {
        title: '状态',
        key:'paymentStatusInfo',
        dataIndex: 'paymentStatusInfo',
        render: value => TextMapPayStatus[value]
      },
      {
        title: '创建时间',
        key:'createTime',
        dataIndex: 'createTime',
      },
      {
        title: '创建人',
        key:'createName',
        dataIndex: 'createName',
      },
      {
        title: '操作时间',
        key:'modifyTime',
        dataIndex: 'modifyTime',
      },
      {
        title: '操作人',
        key:'modifyName',
        dataIndex: 'modifyName',
      },
      {
        title: '操作',
        width: '150px',
        render: (operate, record) => (
          <>
            {
              enumPayType.ToBePaid === record.paymentStatusInfo 
              ? <Button type="primary" onClick={this.handleConfirm(record, 'confirm')}>确认支付</Button>
              : enumPayType.Freezing === record.paymentStatusInfo 
              ? <Button type="primary" disabled>确认支付</Button>
              : enumPayType.Paid === record.paymentStatusInfo 
              ? <Button type="link" onClick={this.handleConfirm(record, 'look')}>查看明细</Button>
              : null 
            }
          </>
        )
      }
    ];
    return(
      <Spin tip="操作处理中..." spinning={false}>
        <Card title="筛选">
          <Form labelCol = {{ span: 8 }} wrapperCol={{ span: 16}}>
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
                  {getFieldDecorator('paymentStatusInfo', {initialValue: ''})(
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
                  {getFieldDecorator('createTime', {initialValue: ''})(
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
                  {getFieldDecorator('modifyTime', {initialValue: ''})(
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
                <Button type="default" onClick={this.handleReset}>取消</Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card style={{ marginTop: 10 }}>
          {list && list.length > 0 ? (
            <Table
              rowSelection={rowSelection}
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
              rowKey={record => record.id}
            />
          ) : (
            '暂无数据'
          )}
        </Card>
        {/* 确认提示弹窗 */}
        <PayModal 
          modalProps={{
            title: this.state.modalTitle,
            visible: this.state.visible, 
            onOk: this.handleRejectOk, 
            onCancel:this.handleRejectCancel, 
            confirmLoading: this.state.confirmLoading
          }}
          handlePayConfirm={this.handlePayConfirm}
          record={record}
          imgList={[
            'https://pics2.baidu.com/feed/9c16fdfaaf51f3de586b533b0dbbdd193b297974.jpeg?token=e35eb97c153e3c56bc63f950cecd6850&s=96B4EC231D9061EF807111F00300C060',
            'https://pics2.baidu.com/feed/9c16fdfaaf51f3de586b533b0dbbdd193b297974.jpeg?token=e35eb97c153e3c56bc63f950cecd6850&s=96B4EC231D9061EF807111F00300C060',
            'https://pics2.baidu.com/feed/9c16fdfaaf51f3de586b533b0dbbdd193b297974.jpeg?token=e35eb97c153e3c56bc63f950cecd6850&s=96B4EC231D9061EF807111F00300C060'
          ]}
        />
      </Spin>
    )
  }
}
export default Form.create()(List);