import React, { Component } from 'react'
import { connect, parseQuery, setQuery } from '@/util/utils'
import { Card, Row, Col, Form, Input, DatePicker, Select, Button, Divider, Table, Modal, message } from 'antd'
import { getList, deleteById } from './api'
import IModal from './modal'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const { Option } = Select
const basePayload = {
  page: 1,
  pageSize: 10
}
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

function getColumns (scope) {
  return [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '热词名称',
      dataIndex: 'name'
    }, {
      title: '排序',
      dataIndex: 'sort'
    }, {
      title: '操作',
      render (_, record) {
        return (
          <>
            <span className='item-detail-btn' onClick={() => scope.edit(record, '编辑热词')}>编辑</span>
            <Divider type='vertical' />
            <span className='item-del-btn' onClick={() => scope.delConfim(record)}>删除</span>
          </>
        )
      }
    }
  ]
}

export default class extends Component {

  state = {
    searchKey: '',
    records: [],
    total: 0,
    loading: false,
    current: 0,
    visible: false,
    item: {}
  }

  componentDidMount () {
    this.pageNo = 1
    this.query()
  }

  query = () => {
    getList({
      pageNo: this.pageNo,
      pageSize: 10,
      name: this.state.searchKey
    }).then(data => {
      if (data) {
        this.setState({
          records: data.records,
          total: data.total,
          current: data.current
        })
      }
    })
  }

  onInviteClick = (item) => {
    const { history } = this.props
    history.push(`/user/detail?memberId=${item.inviteId}`)
  }

  onDetail = (item) => {
    const { history } = this.props
    history.push(`/user/detail?memberId=${item.id}`)
  }

  handleSearch () {
    this.pageNo = 1
    this.query()
  }

  edit (item, modalTitle) {
    this.setState({
      modalTitle,
      visible: true,
      item: item || {}
    })
  }

  delConfim (item) {
    Modal.confirm({
      title: '系统提示',
      content: '确定要删除该消息吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteById(item.id).then(data => {
          if (data) {
            message.success('删除成功')
            this.query()
          }
        })
      }
    })
  }

  renderForm = () => {
    return (
      <Form layout='inline'>
        <FormItem label='热词名称'>
          <Input value={this.state.searchKey} onChange={(e) => this.setState({
            searchKey: e.target.value
          })} />
        </FormItem>
        <FormItem>
          <Button type='primary' style={{ marginRight: 10 }} onClick={() => this.handleSearch()}>查 询</Button>
          <Button style={{ marginRight: 10 }} onClick={() => this.setState({
            searchKey: ''
          })}>重 置
          </Button>
          <Button type='primary' onClick={() => this.edit({}, '新增热词')}>新增热词</Button>
        </FormItem>
      </Form>
    )
  }

  onChange = (pageConfig) => {
    this.pageNo = pageConfig.current
    this.query()
  }

  showTotal = total => {
    return <span>共{total}条数据</span>
  }

  render () {
    const { records, loading, total, current } = this.state
    return (
      <Card>
        <Row>
          <Col style={{ marginBottom: 20 }}>
            {
              this.renderForm()
            }
          </Col>
          <Col>
            <Table
              dataSource={records}
              columns={getColumns(this)}
              pagination={{
                total: total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: this.showTotal,
                current: current
              }}
              onChange={this.onChange}
              rowKey={record => record.id}
              loading={loading}
            />
          </Col>
          <IModal close={(type) => {
            this.setState({
              visible: false
            })
            if (type == 'reload') {
              this.query()
            }
          }} visible={this.state.visible} title={this.state.modalTitle} data={this.state.item} />
        </Row>
      </Card>
    )
  }
}