import React from 'react';
import { Card, Row, Col, Divider, Table, Button } from 'antd';
import MoneyRender from '@/components/money-render'
import { Link } from 'react-router-dom';
import styles from './style.module.styl'
// import { enumOrderStatus } from '../constant';
// import { formatDate } from '../../helper';


class SettleDetialList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '3536',
      storeName: '啊啊啊啊啊',
      currencyInfo: '90',
      incomeMoney: '80',
      disburseMoney: 79,
      settlementMoney: 788,
      invoiceUrl: ['http://img1.imgtn.bdimg.com/it/u=3509396927,751068680&fm=26&gp=0.jpg', 'http://img1.imgtn.bdimg.com/it/u=3509396927,751068680&fm=26&gp=0.jpg'],
      list: [
        { id: 1, billMoney: 2, memberMobile: 2, billName: 5, billTypeInfo: 'etwtesh', createTime: '23' },
        { id: 4566, billMoney: 2, memberMobile: 2, billName: 5, billTypeInfo: 'etwtesh', createTime: '23' },
        { id: 167, billMoney: 2, memberMobile: 2, billName: 5, billTypeInfo: 'etwtesh', createTime: '23' },
        { id: 178, billMoney: 2, memberMobile: 2, billName: 5, billTypeInfo: 'etwtesh', createTime: '23' },

      ]
    };
  }


  render() {
    const {
      id,
      storeName,
      currencyInfo,
      incomeMoney,
      disburseMoney,
      settlementMoney,
      invoiceUrl,
      list = []
    } = this.state


    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: '10%',
        render: (text, record, index) => `${index + 1}`,
      }, {
        title: '单据ID',
        width: '20%',
        dataIndex: 'id'
      }, {
        title: '单据名称',
        width: '20%',
        dataIndex: 'billName'
      }, {
        title: '单据类型',
        width: '15%',
        dataIndex: 'billTypeInfo'
      }, {
        title: '单据金额',
        width: '10%',
        dataIndex: 'billMoney',
        render: MoneyRender,
      }, {
        title: '单据日期',
        width: '10%',
        dataIndex: 'createTime',
        render: MoneyRender
      }
    ];
    return (
      <Card style={{ marginTop: '10px' }}>
        <div className={styles['detail']}>
          <h1 className={styles['detail-title']}>20191209结算单明细</h1>
          <div className={styles['detail-header']}>
            <span>结算单ID: {id} </span>
            <span>供应商: {storeName}</span>
            <span>币种: {currencyInfo}</span>
          </div>
          <hr />
          <div className={styles['detail-cont']}>
            <div className={styles['cont-l']}>
              <div>收入：{incomeMoney}元</div>
              <div>支出：{disburseMoney}元</div>
              <div>本期结算总额：{settlementMoney}元</div>
            </div>
            <div className={styles['cont-r']}>
              <span style={{ float: 'left' }}>发票凭证：</span>
              {invoiceUrl.map((item, index) => <img key={index} style={{ float: 'left', width: '100px', height: '100px', marginRight: "5px" }} src={item} alt='' />)}
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          pagination={false}
          rowKey={record => record.id}
        // expandedRowRender={expandedRowRenderByChildOrder}
        />
        <Row>共计{list.length}条</Row>
        <Row style={{ textAlign: 'center' }}>
          <Button type='primary'>导出明细</Button>
          <Button type='primary' style={{ margin: '0 10px' }}>提交结算</Button>
          <Button onClick={() => APP.history.go(-1)}>返回</Button>
        </Row>
      </Card>
    );
  }
}

export default SettleDetialList