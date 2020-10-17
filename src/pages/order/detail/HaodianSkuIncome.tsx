import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { getSaleSettlementSku } from './api'

interface Props {
  childOrder: any
}
interface State {
  list: {
    /** 用户昵称 */
    nickName: string
    /** pop会员身份 */
    popMemberTypeDesc: string
    /** pop会员手机号 */
    popPhone: string
    /** 已结算金额 */
    settledAmount: number
    /** 结算类型 */
    settlementTypeDesc: string
    /** 未结算金额 */
    unbalancedAmount: number
  }[]
}
class Main extends React.Component<Props, State> {
  public state = {
    list: []
  }
  public componentDidMount () {
    this.fetchData()
  }
  public async fetchData () {
    const childOrder = this.props.childOrder || {}
    const list = await getSaleSettlementSku(childOrder.id)
    this.setState({
      list
    })
  }
  public columns: ColumnProps<any>[] = [{
    title: '姓名',
    dataIndex: 'nickName'
  }, {
    title: '手机号',
    dataIndex: 'popPhone'
  }, {
    title: '类别',
    dataIndex: 'popMemberTypeDesc'
  }, {
    title: '收益类型',
    dataIndex: 'settlementTypeDesc'
  }, {
    title: '已结算收益',
    dataIndex: 'settledAmount',
    render: (text) => APP.fn.formatMoneyNumber(text, 'm2u')
  }, {
    title: '未结算收益',
    dataIndex: 'unbalancedAmount',
    render: (text) => APP.fn.formatMoneyNumber(text, 'm2u')
  }]
  public render () {
    const { list } = this.state
    return (
      <Table
        dataSource={list}
        columns={this.columns}
        pagination={false}
      />
    )
  }
}

export default Main