import React, { Component } from 'react'
import { Card, Table, Tabs } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import AfterSalesDetail from './AfterSalesDetail'
import { namespace } from './model'
import { getSkuServerProcessDetailList } from '../api'
import moment from 'moment'

export interface Logger {
  skuServerId: number
  beforeStatus: string
  afterStatus: string
  createTime: number
  info: any
  operator: string
  name: string
}

interface Params {
  id: number
  orderCode?: number | string
}

const columns: ColumnProps<Logger>[] = [
  {
    title: '内容',
    dataIndex: 'info',
    key: 'info',
    render (list: any, record: Logger, index: number) {
      return (list || []).map((item: any) => <p key={item.createTime}>{item.key}：{item.value}</p>)
    }
  },
  {
    title: '时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render (text: any, record: Logger, index: number) {
      return moment(text).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
    render (text: any, record: Logger, index: number) {
      return `${record.operator}：${record.name}`
    }
  }
]
interface DetailProps extends RouteComponentProps<{ id: any, sourceType: string }> {
  data: AfterSalesInfo.data
}
interface State {
  logs: any[]
}
class Detail extends Component<DetailProps, State> {
  state: State = {
    logs: []
  }
  constructor (props: DetailProps) {
    super(props)
    this.getDetail = this.getDetail.bind(this)
  }
  get refundId () {
    return Number(this.props.match.params.id)
  }
  async fetchLog () {
    /** 海鑫让加的逻辑，这个必须要传id，从对账单跳转过来只有orderCode，所以要单独写字段判断。 */
    const {id, sourceType} = this.props.match.params
    const params: Params = {
      id: !sourceType ? id : 1,
      orderCode: ''
    }
    console.log(sourceType, 'sourceType')
    if (sourceType === 'checking') {
      params.orderCode = id
    }
    const logs = await getSkuServerProcessDetailList(params)
    this.setState({
      logs
    })
  }
  getDetail () {
    /** 海鑫让加的逻辑，这个必须要传id，从对账单跳转过来只有orderCode，所以要单独写字段判断。 */
    const {id, sourceType} = this.props.match.params
    const params: Params = {
      id: !sourceType ? id : 1,
      orderCode: ''
    }
    if (sourceType === 'checking') {
      params.orderCode = id
    }
    APP.dispatch({
      type: `${namespace}/getDetail`,
      payload: params
    })
  }
  componentWillMount () {
    this.getDetail()
    this.fetchLog()
  }
  tabChange = (key: any) => {
    if (key === '2') {
      this.fetchLog()
    }
  }
  render () {
    const dataSource: any = (this.state.logs || []).map((v: any, i: any) => ({ ...v, uniqueKey: i }))
    return (
      <>
        <Card>
          <Tabs onChange={this.tabChange}>
            <Tabs.TabPane tab='售后详情' key='1'>
              <AfterSalesDetail />
            </Tabs.TabPane>
            <Tabs.TabPane tab='信息记录' key='2'>
              <Table
                rowKey={(record: any, index: number) => String(record.uniqueKey)}
                dataSource={dataSource}
                pagination={false}
                columns={columns}
              />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </>
    )
  }
}
export default connect((state: any) => {
  return {
    data: (state[namespace] && state[namespace].data) || {}
  }
})(Detail)
