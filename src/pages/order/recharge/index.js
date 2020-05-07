import React, { Component } from 'react'
import { Tabs, Card, Form, DatePicker, Button, Row, Col, Table, Input } from 'antd'
const { TabPane } = Tabs
const FormItem = Form.Item
const { RangePicker } = DatePicker
import { queryBannerList } from '../api'
import { formatDate } from '../../helper'
import moment from 'moment'
import Search from './Search'
import { namespace } from './config'

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
    tab: '0'
  };

  componentDidMount () {
    this.query()
  }

  query = () => {
    const payload = APP.fn.getPayload(namespace) || {}
    this.setState({
      page: this.payload.page,
      pageSize: this.payload.pageSize
    })
    queryBannerList({
      ...payload,
      ...this.payload,
      tab: this.state.tab
    }).then(res => {
      this.setState({
        list: res.records,
        total: res.total
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
      tab: key
    }, ()=>{
      this.payload.page= 1
      this.query()
    })
  };
  render () {
    const tabList=[{ name: '全部', key: '0' }, { name: '待充值', key: '1' }, { name: '充值中', key: '2' }, { name: '充值成功', key: '3' }, { name: '充值失败', key: '4' }]
    const { current, total, pageSize } = this.state

    const columns = [
      {
        title: '充值单号',
        align: 'center',
        dataIndex: 'sort'
      },
      {
        title: '子订单号',
        dataIndex: 'title'
      },
      {
        title: '三方订单号',
        dataIndex: 'onlineTime',
        render (onlineTime) {
          return formatDate(onlineTime)
        }
      },
      {
        title: '充值流水号',
        dataIndex: 'offlineTime',
        render (offlineTime) {
          return formatDate(offlineTime)
        }
      },
      {
        title: '充值账号',
        dataIndex: 'jumpUrlWap',
        render: (text) => {
          return (
            <span className='href' onClick={() => APP.href(text, '__blank')}>{text}</span>
          )
        }
      },
      {
        title: '充值面额',
        dataIndex: 'seat',
        render (seat, record) {
          return <span>{record.newSeatStr}/{record.childSeatStr}</span>
        }
      },
      {
        title: '充值类型',
        dataIndex: 'status',
        render (status) {
          return status ? '开启' : '关闭'
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '300px',
        render: (createTime, row) => <div>{formatDate(createTime)}</div>
      },
      {
        title: '状态',
        dataIndex: 'ti32tle'
      },
      {
        title: '完成时间',
        dataIndex: 'createTwime',
        width: '300px',
        render: (createTime, row) => <div>{formatDate(createTime)}</div>
      },
      {
        title: '备注',
        dataIndex: 'titlw'
      }
    ].filter(column => !column.hide)
    return (
      <div>
        <Card>
          <Tabs activeKey={this.state.tab} defaultActiveKey={'1'} onTabClick={this.handleTabClick}>
            {tabList.map(tab => {
              return (<TabPane tab={tab.name} key={tab.key} />
              )
            })}
          </Tabs>
          <Search
            className='ml10'
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
