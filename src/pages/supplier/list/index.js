import React from 'react'
import { Table, Card, Form, Input, Button, DatePicker, InputNumber } from 'antd'
import moment from 'moment'
import { querySupplierList, exportSupplier } from '../api'
import SupplierModal from '../supplier-modal'
import AccountModal from '../account-modal'
import SupplierTypeSelect from '@/components/supplier-type-select'
const FormItem = Form.Item

const { RangePicker } = DatePicker
class OrderList extends React.Component {
  static defaultProps = {}
  pathname = this.props.location.pathname
  payload = APP.fn.getPayload(this.pathname) || {}
  state = {
    selectedRowKeys: [],
    list: [],
    current: 1,
    pageSize: 20,
    total: 0
  }

  componentDidMount () {
    this.query()
  }

  query = () => {
    let params = {
      ...this.props.form.getFieldsValue(),
      page: this.state.current,
      pageSize: this.state.pageSize
    }
    const [startTime, endTime] = params.createTime || []

    params = {
      ...params,
      createTime: undefined,
      startTime: startTime ? +new Date(startTime) : undefined,
      endTime: endTime ? +new Date(endTime) : undefined
    }

    querySupplierList(params).then((res = {}) => {
      this.setState({
        list: res.records,
        pageSize: res.size,
        total: res.total
      })
    })
  };

  reset = () => {
    this.payload = {}
    APP.fn.setPayload(this.pathname, this.payload)
    this.props.form.resetFields()
    this.query()
  };
  handleSearch = () => {
    const {
      form: { validateFields }
    } = this.props

    validateFields((err, vals) => {
      if (!err) {
        this.setState({ current: 1 }, this.query)
      }
    })
  }
  export = () => {
    let params = {
      ...this.props.form.getFieldsValue(),
      page: this.state.current,
      pageSize: this.state.pageSize
    }
    const [startTime, endTime] = params.createTime || []

    params = {
      ...params,
      createTime: undefined,
      startTime: startTime ? +new Date(startTime) : undefined,
      endTime: endTime ? +new Date(endTime) : undefined
    }

    exportSupplier(params).then(res => {
      console.log(1111)
    })
  }

  handlePageChange = (page, pageSize) => {
    this.setState(
      {
        current: page,
        pageSize
      },
      this.query,
    )
  }
  render () {
    const { total, pageSize, current } = this.state
    const {
      form: { getFieldDecorator }
    } = this.props

    const columns = [
      {
        title: '供应商ID',
        dataIndex: 'id'
      },
      {
        title: '供应商名称',
        dataIndex: 'name'
      }, {
        title: '保证金金额',
        dataIndex: 'name'
      },
      {
        title: '联系人',
        dataIndex: 'contacts'
      },
      {
        title: '联系电话',
        dataIndex: 'phone'
      },
      {
        title: '联系邮箱',
        dataIndex: 'email'
      },
      {
        title: '前台展示',
        dataIndex: 'showType',
        render: (showType, record) => {
          const { category } = record
          const text = [0, 1, 3, 4].indexOf(category) !== -1 ? showType === 1 ? '开启' : '关闭' : '-'
          return text
        }
      },
      {
        title: '操作',
        width: 200,
        render: (operator, record) => {
          return (
            <>
              <SupplierModal onSuccess={this.query} isEdit id={record.id} />
              <AccountModal onSuccess={this.query} {...record} />
            </>
          )
        }
      }
    ].filter(column => !column.hide)
    const values = this.payload
    values.createTime = values.startTime && [moment(values.startTime), moment(values.endTime)]
    return (
      <>
        <Card title='筛选'>
          <Form
            layout='inline'
          >
            <FormItem label='供应商名称'>
              {getFieldDecorator('name', {
                initialValue: values.name
              })(<Input placeholder='请输入供应商名称' />)}
            </FormItem>
            <FormItem label='供应商ID'>
              {getFieldDecorator('id', {
                initialValue: values.id
              })(<InputNumber style={{ width: 172 }} placeholder='请输入供应商ID' />)}
            </FormItem>
            <FormItem label='联系人'>
              {getFieldDecorator('contacts', {
                initialValue: values.contacts
              })(<Input placeholder='请输入联系人' />)}
            </FormItem>
            <FormItem label='供应商分类'>
              {getFieldDecorator('category', {
                initialValue: values.category
              })(<SupplierTypeSelect />)}
            </FormItem>
            <FormItem label='创建时间'>
              {getFieldDecorator('createTime', {
                initialValue: values.createTime
              })(<RangePicker showTime />)}
            </FormItem>
            <FormItem>
              <Button type='default' onClick={this.reset}>
                清除条件
              </Button>
              <Button type='primary' style={{ margin: '0 10px' }} onClick={this.handleSearch}>
                查询
              </Button>
              <Button type='primary' style={{ margin: '0 10px' }} onClick={this.export}>
                导出供应商
              </Button>
            </FormItem>
          </Form>
          <SupplierModal onSuccess={this.query} isEdit={false} />
        </Card>
        <Card style={{ marginTop: 10 }}>
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
            rowKey={record => record.id}
          />
        </Card>
      </>
    )
  }
}

export default Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    const [startTime, endTime] = allValues.createTime || []
    const params = {
      ...allValues,
      startTime: startTime ? +new Date(startTime) : undefined,
      endTime: endTime ? +new Date(endTime) : undefined
    }
    APP.fn.setPayload(props.location.pathname, params)
  }
})(OrderList)
