import React, { Component } from 'react'
import { FormInstance } from '@/packages/common/components/form'
import { Tabs, Card, Table } from 'antd'
import moment from 'moment'
import { ColumnProps } from 'antd/es/table'
import * as api from './api'
import { detailTabHear, auditAfterInfoTemplate, applyInfoTemplate, orderInfo, AuditTemplate } from './components'
const { TabPane } = Tabs
import style from './style.m.styl'

export interface Logger {
  skuServerId: number
  beforeStatus: string
  afterStatus: string
  createTime: number
  info: any
  operator: string
  name: string
}
interface State {
  type: string
  dataSource: any
  orderTrajectory: []
}

class Order extends Component<any, State> {
  public form: FormInstance
  public columns: ColumnProps<Logger>[] = [
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
  constructor (props: any) {
    super(props)
    this.state = {
      type: 'detail',
      dataSource: {},
      orderTrajectory: []
    }
  }
  public componentDidMount () {
    this.getOrderDetail()
  }

  /**
   * 获取订单详情
   *
   * @memberof Order
   */
  public getOrderDetail = () => {
    const { refundCode } = this.props.match.params
    api.getOrderDetail(refundCode).then(res => {
      this.setState({
        dataSource: res
      })
    })
  }

  /**
   * 提交审核
   *
   * @memberof Order
   */
  public saveAudit = (fromValues: any) => {
    const { refundCode } = this.state.dataSource
    const refundAuditImageS = fromValues.refundAuditImageS && fromValues.refundAuditImageS.map((img: any) => {
      return img.url
    })
    return api.orderAudit({
      ...fromValues,
      refundCode,
      refundAuditImageS,
      auditRefundAmount: fromValues.auditRefundAmount * 100
    }).then(() => {
      this.getOrderDetail()
    })
  }

  public handleTabChange = (type: string) => {
    const { skuServerId, refundCode } = this.state.dataSource
    if (type === 'record') {
      api.getOrderTrajectory(skuServerId, refundCode).then(res => {
        this.setState({
          orderTrajectory: res
        })
      })
    }
  }
  public render () {
    const { dataSource, orderTrajectory } = this.state
    const { refundStatus } = dataSource
    return (
      <Card>
        <Tabs onChange={this.handleTabChange}>
          <TabPane className={style['detail-tab']} tab='售后详情' key='detail'>
            {detailTabHear(dataSource)}
            {dataSource && dataSource.handleInfo && auditAfterInfoTemplate(dataSource)}
            {dataSource && applyInfoTemplate(dataSource)}
            {dataSource.orderWideDO && dataSource.selfDeliveryPointDO && orderInfo(dataSource)}
            {
              refundStatus === 10 || refundStatus === 24 ? (
                <AuditTemplate saveAudit={this.saveAudit} dataSource={dataSource}></AuditTemplate>
              ) : ''
            }
          </TabPane>
          <TabPane tab='信息记录' key='record'>
            <Table
              rowKey={(record: any, index: number) => String(record.uniqueKey)}
              dataSource={orderTrajectory}
              pagination={false}
              columns={this.columns}
            />
          </TabPane>
        </Tabs>
      </Card>
    )
  }
}

export default Order
