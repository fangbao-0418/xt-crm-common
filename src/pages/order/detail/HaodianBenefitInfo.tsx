import React from 'react'
import { Row, Button, Table, AutoComplete } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { Alert } from '@/packages/common/components'
import { AlertComponentProps } from '@/packages/common/components/alert'
import HaodianEarningsDetail from './components/modal/HaodianEarningsDetail'
import { getOrderSettlement, getSettlementOrderDetail } from './api'

interface Detail {
  /** 供应商结算 */
  supplierSettlementAmount: number
  /** 平台自留 */
  platformSettlementAmount: number
  /** 订单实付金额 */
  payAmount: number
  /** 代理分佣 */
  agentSettlementAmount: number
  /** 整单收益信息 */
  list: {
    childOrderList: {
      /** 子订单 code */
      chileOrderCode: string
      /** 子订单 id */
      chileOrderId: string
      /** 商品 id */
      productId: number
      /** 已结算金额 */
      settledAmount: number
      /** 结算类型 */
      settlementTypeDesc: string
      /** shu名称 */
      skuName: string
      /** 未结算金额 */
      unbalancedAmount: number
    }[],
    /** 姓名 */
    nickName: string
    /** 手机号 */
    popPhone: string
    /** 收益类型 */
    settlementTypeDesc: string
    /** 已结算收益 */
    settledAmount: number
    /** 未结算收益 */
    unbalancedAmount: number
  }[]
}

interface Props extends AlertComponentProps{
  orderInfo: any
}

interface State {
  detail: Partial<Detail>
}
class Main extends React.Component<Props, State> {
  public state: State = {
    detail: {}
  }
  public columns: ColumnProps<any>[] = [{
    title: '类别',
    dataIndex: 'popMemberTypeDesc'
  }, {
    title: '姓名',
    dataIndex: 'nickName'
  }, {
    title: '手机号',
    dataIndex: 'popPhone'
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
  public showModal = async (payload: any) => {
    const detail = await getSettlementOrderDetail(payload)
    this.props.alert({
      title: '收益详情',
      width: 900,
      content: <HaodianEarningsDetail detail={detail} />
    })
  }
  public componentDidUpdate (prevProps: Props) {
    const id = prevProps?.orderInfo?.id
    if (id && id !== this.props?.orderInfo?.id) {
      this.fetchData()
    }
  }
  public async fetchData () {
    const orderInfo = this.props.orderInfo || {}
    const detail = await getOrderSettlement(orderInfo.id)
    this.setState({ detail })
  }
  public render () {
    const { detail } =  this.state
    return (
      <>
        <Row type='flex' justify='space-between' align='middle'>
          <span>预计盈利信息</span>
          <Button type='primary'>收益重跑</Button>
        </Row>
        <Row>成交金额：{ APP.fn.formatMoneyNumber(detail.payAmount!, 'm2u') }</Row>
        <Row>成本金额：{ APP.fn.formatMoneyNumber(detail.supplierSettlementAmount!, 'm2u') }</Row>
        <Row>代理分佣：{ APP.fn.formatMoneyNumber(detail.agentSettlementAmount!, 'm2u') }</Row>
        <Row>平台自留：{ APP.fn.formatMoneyNumber(detail.platformSettlementAmount!, 'm2u') }</Row>
        <Table
          columns={this.columns}
          dataSource={ detail.list }
          expandedRowRender={(record: any) => (
            <Table
              columns={[{
                title: '子订单号',
                dataIndex: 'chileOrderCode',
                render: (text: number, data: any) => (
                  <span
                    className='href'
                    onClick={this.showModal.bind(null, {
                      childOrderId: data.chileOrderId,
                      memberId: record.memberId
                    })}
                  >
                    {text}
                  </span>
                ) 
              }, {
                title: 'SKU名称',
                dataIndex: 'skuName'
              }, {
                title: '商品id',
                dataIndex: 'productId'
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
              }]}
              dataSource={record.childOrderList}
              pagination={false}
            />
          )}
          pagination={false}
        />
      </>
    )
  }
}

export default Alert(Main)