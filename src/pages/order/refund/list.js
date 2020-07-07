import React from 'react'
import PropTypes from 'prop-types'
import { Message, Button } from 'antd'
import moment from 'moment'
import CommonTable from '@/components/common-table'
import SearchForm from '@/components/search-form'
import MoneyRender from '@/components/money-render'
import GoodCell from '@/components/good-cell'
import { formFields, typeMapRefundStatus, namespace, refundStatusOptions } from './config'
import { withRouter } from 'react-router-dom'
import { formatDate } from '@/pages/helper'
import { parseQuery } from '@/util/utils'
import { refundList, exportRefund, getPhoneById } from '../api'
import styles from './style.m.styl'

const dateFormat = 'YYYY-MM-DD HH:mm'

const formatFields = range => {
  range = range || []
  return range.map(v => v && v.format(dateFormat))
}
const getFormatDate = (s, e) => {
  return e ? [moment(s, dateFormat), moment(e, dateFormat)] : []
}

const getListColumns = ({ query, history }) => [
  {
    title: '商品ID',
    dataIndex: 'productId',
    width: 100
  },
  {
    title: '商品',
    dataIndex: 'skuName',
    width: 300,
    render (skuName, row) {
      return <GoodCell {...row} showImage={false} isRefund />
    }
  },
  {
    title: '售后状态',
    dataIndex: 'refundStatusStr',
    width: 100
  },
  {
    title: '售后类型',
    dataIndex: 'refundTypeStr',
    width: 100
  },
  {
    title: '申请售后数目',
    dataIndex: 'serverNum',
    width: 150
  },
  {
    title: '申请售后金额',
    dataIndex: 'amount',
    width: 150,
    render: MoneyRender
  },
  {
    title: '供应商',
    dataIndex: 'storeName',
    width: 200
  },
  {
    title: '买家信息',
    dataIndex: 'userName',
    width: 200,
    render (v, record) {
      return `${v ? v : ''} ${record.phone ? `(${record.phone})` : ''}`
    }
  },
  {
    title: '处理人',
    dataIndex: 'operator',
    width: 200,
    render: (text) => text || '-'
  },
  {
    title: '最后处理时间',
    dataIndex: 'handleTime',
    width: 200,
    render: (text) => text ? formatDate(text) : '-'
  },
  {
    title: '供应商操作',
    dataIndex: 'supplierOperate',
    width: 100,
    render: (text) => {
      return text === 10 ? '同意' : '-'
    }
  },
  {
    title: '操作',
    width: 100,
    dataIndex: 'record',
    fixed: 'right',
    render: (text, { id }) => {
      return (
        <Button type='primary' size='small' onClick={() => history.push(`/order/refundOrder/${id}`)}>查看详情</Button>
      )
    }
  }
]

@withRouter
export default class extends React.Component {
  payload = APP.fn.getPayload(namespace) || {}
  static defaultProps = {}
  static propTypes = {
    type: PropTypes.string
  }
  state = {
    selectedRowKeys: [],
    list: [],
    current: this.payload.page || 1,
    pageSize: this.payload.pageSize || 10,
    total: 0,
    loading: false,
    tableConfig: {},
    expands: []
  };

  componentDidMount () {
    this.setFieldsValue(() => {
      this.query()
    })
  }

  query = (isExport = false, noFetch = false) => {
    const { intercept, type } = this.props
    /** 获取url参数 */
    const obj = parseQuery()
    const fieldsValues = this.SearchForm.props.form.getFieldsValue()
    const [applyStartTime, applyEndTime] = formatFields(fieldsValues['apply'])
    const [handleStartTime, handleEndTime] = formatFields(fieldsValues['handle'])
    const [payStartTime, payEndTime] = formatFields(fieldsValues['payTime'])
    delete fieldsValues['apply']
    delete fieldsValues['handle']
    delete fieldsValues['payTime']
    let refundStatus = fieldsValues.refundStatus ? fieldsValues.refundStatus : null
    const params = {
      ...fieldsValues,
      applyStartTime,
      applyEndTime,
      handleStartTime,
      handleEndTime,
      payStartTime,
      payEndTime,
      refundStatus,
      page: this.state.current,
      pageSize: this.state.pageSize,
      ...obj
    }
    if (intercept) {
      params.interception = 1
      params.interceptionMemberPhone = obj.iphone
    }
    refundStatus = refundStatus || typeMapRefundStatus[this.props.type]
    params.refundStatus = refundStatus && Number.isInteger(refundStatus) ? [refundStatus] : refundStatus
    console.log(params.refundStatus, 'params.refundStatus', params)
    if (params&&params.shopPhone) {
      getPhoneById({ phone: fieldsValues.shopPhone }).then((res = {}) => {
        if (res.id) {
          params.shopId=res.id
        } else {
          params.shopId=-100
        }
        this.loadData(isExport, params, noFetch)
      })
    } else {
      this.loadData(isExport, params, noFetch)
    }
    APP.fn.setPayload(namespace, {
      ...params,
      type
    })
  }

  loadData (isExport, params, noFetch) {
    if (params.shopType) {
      params.shopType=(params.shopType).toString()
    }
    if (isExport) {
      this.setState({
        loading: true
      })
      exportRefund(params)
        .then(res => {
          res && Message.success('导出成功')
        })
        .finally(() => {
          this.setState({
            loading: false
          })
        })
    } else {
      if (noFetch) {
        return
      }
      refundList(params).then(res => {
        const records = (res.data && res.data.records) || []
        this.setState({
          tableConfig: res.data || {},
          expands: records.map(v => v.orderCode)
        })
      })
    }
  }

  handleSearch = () => {
    const { intercept } = this.props
    if (!intercept) {
      APP.history.push('/order/refundOrder')
    }
    this.setState(
      {
        current: 1
      },
      this.query
    )
  }

  export = () => {
    this.query(true)
  }

  handlePageChange = pagination => {
    this.setState(
      {
        current: pagination.page,
        pageSize: pagination.pageSize
      },
      this.query
    )
  }

  handleFormat = data => {
    return data
  }

  setFieldsValue = (cb) => {
    const { type, intercept } = this.props
    const payload = this.payload
    const options = formFields(this.props.type, intercept)
    const fieldsValue = {
      mainOrderCode: payload.mainOrderCode,
      orderCode: payload.orderCode,
      refundType: payload.refundType === undefined ? options.find(item => item.id === 'refundType')?.initialValue: payload.refundType,
      memberPhone: payload.memberPhone,
      phone: payload.phone,
      storeId: payload.storeId,
      productId: payload.productId,
      operator: payload.operator,
      createType: payload.createType === undefined ? options.find(item => item.id === 'createType')?.initialValue : payload.createType,
      apply: getFormatDate(payload.applyStartTime, payload.applyEndTime),
      handle: getFormatDate(payload.handleStartTime, payload.handleEndTime),
      payTime: getFormatDate(payload.payStartTime, payload.payEndTime),
      expressCode: payload.expressCode,
      orderType: payload.orderType === undefined ? options.find(item => item.id === 'orderType')?.initialValue : payload.orderType,
      interception: payload.interception === undefined ? options.find(item => item.id === 'interception')?.initialValue : payload.interception,
      interceptionMemberPhone: payload.interceptionMemberPhone,
      storeType: payload.storeType === undefined ? options.find(item => item.id === 'storeType')?.initialValue : payload.storeType,
      smallShopOrder: payload.smallShopOrder === undefined ? options.find(item => item.id === 'smallShopOrder')?.initialValue: payload.smallShopOrder,
      autoAudit: payload.autoAudit === undefined ? options.find(item => item.id === 'autoAudit')?.initialValue : payload.autoAudit,
      shopType: payload.shopType,
      shopPhone: payload.shopPhone
    }
    const refundStatusOptionsOptions = refundStatusOptions[type]
    if (refundStatusOptionsOptions.length > 1 && (payload.refundStatus?.length)) {
      fieldsValue.refundStatus = payload.refundStatus[0] || options.find(item => item.id === 'refundStatus')?.initialValue
    }
    this.SearchForm.props.form.setFieldsValue(fieldsValue, cb)
  }

  render () {
    const {
      tableConfig: { records = [], total = 0, current = 0, size = 10 }
    } = this.state
    const { intercept } = this.props

    return (
      <div className={styles.page}>
        <SearchForm
          className='mb16'
          wrappedComponentRef={ref => (this.SearchForm = ref)}
          format={this.handleFormat}
          search={this.handleSearch}
          clear={this.handleSearch}
          options={formFields(this.props.type, intercept)}
        >
          <Button type='primary' onClick={this.export}>
            导出订单
          </Button>
        </SearchForm>
        {records && records.length ? (
          <CommonTable
            bordered
            columns={getListColumns({ query: this.query, history: this.props.history })}
            dataSource={records}
            current={current}
            total={total}
            size={size}
            expandedRowRender={record => (
              <div
                className='expanded-row-wrapped'
              >
                <span>售后单编号：{record.orderCode}</span>
                <span>订单编号：{record.mainOrderCode}</span>
                <span>申请时间：{formatDate(record.createTime)}</span>
              </div>
            )}
            expandedRowKeys={this.state.expands}
            onExpand={(expanded, record) => {
              let expands = this.state.expands
              if (expanded) {
                expands.push(record.orderCode)
              } else {
                expands = expands.filter(v => v !== record.orderCode)
              }
              this.setState({ expands })
            }}
            onChange={this.handlePageChange}
            rowKey={record => record.orderCode}
            scroll={{ x: 1800 }}
          />
        ) : null}
      </div>
    )
  }
}
