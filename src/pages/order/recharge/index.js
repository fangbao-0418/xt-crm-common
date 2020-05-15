import React, { Component } from 'react'
import { Tabs, Card, Form, DatePicker, Button, Row, Col, Table, Input } from 'antd'
const { TabPane } = Tabs
const FormItem = Form.Item
const { RangePicker } = DatePicker
import { rechargeList, rechargeExport } from '../api'
import { formatDate } from '../../helper'
import moment from 'moment'
import Search from './Search'
import { namespace } from './config'
import { formatMoneyWithSign } from '@/pages/helper'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'
class Recharge extends Component {
  static defaultProps = {};
  payload = {
    page: 1,
    pageSize: 10
  }
  state = {
    selectedRowKeys: [],
    list: [],
    current: 1,
    pageSize: 10,
    total: 0,
    rechargeStatus: '-1'
  };

  componentDidMount () {
    this.query()
  }
  export () {
    const payload = APP.fn.getPayload(namespace) || {}
    if (this.payload.createdTime&&this.payload.createdTime.length>0) {
      this.payload.createTimeBegin= moment(this.payload.createdTime[0]).valueOf()
      this.payload.createTimeEnd= moment(this.payload.createdTime[1]).valueOf()
      delete this.payload.createdTime

    }
    if (this.payload.finishTime&&this.payload.finishTime.length>0) {
      this.payload.finishTimeBegin= moment(this.payload.finishTime[0]).valueOf()
      this.payload.finishTimeEnd= moment(this.payload.finishTime[1]).valueOf()
      delete this.payload.finishTime
    }
    rechargeExport({
      ...payload,
      ...this.payload,
      rechargeStatus: this.state.rechargeStatus==='-1'?null:this.state.rechargeStatus
    }).then(res => {
    })
  }
  query = () => {
    const payload = APP.fn.getPayload(namespace) || {}
    this.setState({
      page: this.payload.page,
      pageSize: this.payload.pageSize
    })
    if (this.payload.createdTime&&this.payload.createdTime.length>0) {
      this.payload.createTimeBegin= moment(this.payload.createdTime[0]).valueOf()
      this.payload.createTimeEnd= moment(this.payload.createdTime[1]).valueOf()
      delete this.payload.createdTime
    }
    if (this.payload.finishTime&&this.payload.finishTime.length>0) {
      this.payload.finishTimeBegin= moment(this.payload.finishTime[0]).valueOf()
      this.payload.finishTimeEnd= moment(this.payload.finishTime[1]).valueOf()
      delete this.payload.finishTime
    }
    rechargeList({
      ...payload,
      ...this.payload,
      rechargeStatus: this.state.rechargeStatus==='-1'?null:this.state.rechargeStatus
    }).then(res => {
      this.setState({
        list: res&&res.records,
        total: res&&res.total
      })
    })
  };

  handlePageChange = (page, pageSize) => {
    this.payload.page = page
    this.setState(
      {
        current: page,
        pageSize
      },
      this.query,
    )
  };
  constructor (props) {
    super(props)
    this.state = {}
  }
  handleTabClick = key => {
    this.setState({
      rechargeStatus: key
    }, ()=>{
      this.payload.page= 1
      this.query()
    })
  };
  render () {
    const tabList=[{ name: '全部', key: '-1' }, { name: '待充值', key: '0' }, { name: '充值中', key: '10' }, { name: '充值成功', key: '20' }, { name: '充值失败', key: '30' }]
    const { current, total, pageSize } = this.state

    const columns = [
      {
        title: '充值单号',
        dataIndex: 'serialNo'
      },
      {
        title: '子订单号',
        dataIndex: 'childOrderCode'
      },
      {
        title: '三方订单号',
        dataIndex: 'thirdPartyOrderNo'
      },
      {
        title: '充值流水号',
        dataIndex: 'rechargeOperatorOrderNo'
      },
      {
        title: '充值账号',
        dataIndex: 'rechargeAccount'
      },
      {
        title: '充值面额',
        dataIndex: 'rechargeDenomination',
        render: (rechargeDenomination, row) => <div>{formatMoneyWithSign(rechargeDenomination)}</div>
      },
      {
        title: '充值类型',
        dataIndex: 'rechargeTypeDesc'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (createTime, row) => <div>{formatDate(createTime)}</div>
      },
      {
        title: '状态',
        dataIndex: 'rechargeStatusDesc'
      },
      {
        title: '完成时间',
        dataIndex: 'finishTime',
        render: (finishTime, row) => <div>{formatDate(finishTime)}</div>
      },
      {
        title: '备注',
        dataIndex: 'titlw'
      }
    ].filter(column => !column.hide)
    return (
      <div>
        <Card>
          <Tabs activeKey={this.state.rechargeStatus} defaultActiveKey={'-1'} onTabClick={this.handleTabClick}>
            {tabList.map(tab => {
              return (<TabPane tab={tab.name} key={tab.key} />
              )
            })}
          </Tabs>
          <Search
            className='ml10'
            export={()=>{
              this.export()
            }}
            onChange={(value) => {
              this.payload = {
                ...this.payload,
                ...value,
                page: 1
              }
              this.query()
            }}
          />
          <Table
            bordered
            style={{ marginTop: 10 }}
            columns={columns}
            dataSource={this.state.list}
            scroll={{
              x: '100%'
            }}
            pagination={{
              current,
              total,
              pageSize,
              onChange: this.handlePageChange
            }}
            rowKey={record => record.id}
          />
        </Card>
      </div>
    )
  }
}

export default Recharge
