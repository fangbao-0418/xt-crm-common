import React from 'react';
import { Card, Row, Table, Button } from 'antd';
import Image from '@/components/Image'
import styles from './style.module.styl'
import { enumPayType } from '../../constant';
import { download } from '@/util/utils';


class SettleDetialList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource
    };
  }
  getUrl (url) {
    url = /^http/.test(url) ? url : `https://assets.hzxituan.com/${url}`
    return url
  }
  render() {
    const { settleDetail = {}, dataSource = [] } = this.props
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 100,
        render: (text, record, index) => `${index + 1}`,
      }, {
        title: '单据ID',
        width: 150,
        dataIndex: 'billSerialNo'
      }, {
        title: '单据名称',
        width: 250,
        dataIndex: 'billName'
      }, {
        title: '单据类型',
        width: 150,
        dataIndex: 'billTypeInfo'
      }, {
        title: '单据金额',
        width: 150,
        dataIndex: 'billMoney',
        render: (billMoney, record) => {
          return <span style={{color: record.financeType === 1 ? 'green' : 'red'}}>{APP.fn.formatMoneyNumber(billMoney, 'm2u')}</span>
        },
      }, {
        title: '单据日期',
        width: 150,
        dataIndex: 'createTime',
        render: (createTime) => {
          return APP.fn.formatDate(createTime, 'YYYYMMDD')
        }
      }
    ];
    return (
      <Card style={{ marginTop: '10px' }}>
        <div className={styles['detail']}>
          <h1 className={styles['detail-title']}>{settleDetail.settName}</h1>
          <div className={styles['detail-header']}>
            <span>结算单ID: {settleDetail.serialNo} </span>
            <span>供应商: {settleDetail.storeName}</span>
            <span>币种: {settleDetail.currencyInfo}</span>
          </div>
          <hr />
          <div className={styles['detail-cont']}>
            <div className={styles['cont-l']}>
              <div>收入：<span className={styles['detail-money-in']}>{APP.fn.formatMoney(settleDetail.incomeMoney)}</span>元</div>
              <div>支出：<span className={styles['detail-money-out']}>{APP.fn.formatMoney(settleDetail.disburseMoney)}</span>元</div>
              <div>本期结算总额：<span className={settleDetail.settlementMoney >= 0 ? styles['detail-money-in'] : styles['detail-money-out']}>{APP.fn.formatMoney(Math.abs(settleDetail.settlementMoney))}</span>元</div>
            </div>
            <div className={styles['cont-r']}>
              <span>发票凭证：</span>
              {settleDetail.invoiceUrl && (
                <Button className={styles['paddingleft0']} type='link' onClick={() => download(this.getUrl(settleDetail.invoiceUrl), '发票凭证.xls')}>下载</Button>
              )}
            </div>
          </div>
        </div>
        <Table
          scroll={{
            x: columns.map((item) => Number(item.width || 0)).reduce((a, b) => {
              return a + b
            })
          }}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowKey={record => record.id}
        />
        <Row>共计{dataSource.length}条</Row>
        <Row style={{ textAlign: 'center' }}>
          {enumPayType.ToBePaid === this.props.settStatus && <Button type='primary' style={{ margin: '0 10px' }}>提交结算</Button>}
          <Button onClick={() => APP.history.go(-1)}>返回</Button>
        </Row>
      </Card>
    );
  }
}

export default SettleDetialList