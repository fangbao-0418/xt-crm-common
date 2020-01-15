/** 收益明细 */
import React from 'react'
import { Table, Row, Col } from 'antd'
import { ColumnProps } from 'antd/es/table'
import MoneyRender from '@/components/money-render'
import { MemberSnapshot, EarningsSnapshot } from '../../interface'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { tileUpConvertTree, tileDownConvertTree } from '@/packages/common/utils'
import Tier from '../tier'
import styles from './styles.module.styl'
interface Props {
  detail: EarningsSnapshot
}
class Main extends React.Component<Props> {
  public form: FormInstance
  public columns: ColumnProps<any>[] = [
    {
      title: '时间',
      width: '20%',
      dataIndex: 'occurrenceTime'
    }, {
      title: '收益类型',
      width: '15%',
      dataIndex: 'incomeTypeDesc'
    }, {
      title: '事件',
      width: '15%',
      dataIndex: 'operatorTypeDesc'
    }, {
      title: '收益金额',
      width: '15%',
      dataIndex: 'amount',
      render: MoneyRender
    }, {
      title: '结算状态',
      width: '20%',
      dataIndex: 'settleStatus'
    }, {
      title: '结算时间',
      width: '20%',
      dataIndex: 'settleTime',
    }
  ];
  public componentDidMount () {
    const detail = this.props.detail
    this.form.setValues({
      ...detail
    })
  }
  public render () {
    const detail = this.props.detail
    const dataSource = detail.details || []
    const priceDetail = detail.priceDetail || []
    const afterSales = detail.afterSales || []
    const memberSnapshots = detail.memberSnapshots || []
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16}
    }
    const parent = memberSnapshots.find((item) => item.isBuyer)
    const tier = parent ? tileUpConvertTree<MemberSnapshot>(memberSnapshots, 'parentMemberId', 'memberId', parent.parentMemberId) : []
    return (
      <div className={styles['earnings-detail']}>
        <Form
          formItemStyle={{margin: 0}}
          getInstance={(ref) => this.form = ref}
          readonly
        >
          <FormItem label='主订单号' name='orderCode' />
          <FormItem label='商品名称' name='skuName' />
          <FormItem label='购买数量' name='quantity' />
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label='商品实付金额' name='preferentialTotalPrice' />
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label='收益类型' name='incomeTypeDesc' />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label='下单人昵称' name='buyerNickName' />
              <FormItem {...formItemLayout} label='下单人用户ID' name='buyerId' />
              <FormItem {...formItemLayout} label='下单人手机' name='buyerMobile' />
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label='收益人昵称' name='memberNickName' />
              <FormItem {...formItemLayout} label='收益人用户ID' name='memberId' />
              <FormItem {...formItemLayout} label='收益人手机' name='memberMobile' />
            </Col>
          </Row>
          <div>
            <div className='mt10 mb10'><b>层级价格快照</b></div>
            <Table
              rowKey={(record, index) => {
                return index + ''
              }}
              columns={[{
                dataIndex: 'dealPrice',
                title: '活动价'
              },{
                dataIndex: 'headPrice',
                title: '团长价'
              },{
                dataIndex: 'areaMemberPrice',
                title: '区长价'
              },{
                dataIndex: 'cityMemberPrice',
                title: '合伙人价'
              },{
                dataIndex: 'managerMemberPrice',
                title: '***价'
              }]}
              dataSource={priceDetail}
              pagination={false}
            >
            </Table>
          </div>
          <div>
            <div className='mt10 mb10'>
              <b>售后信息：收益售后扣除比例{APP.fn.formatMoneyNumber(this.props.detail.deductRatio)}%</b>
            </div>
            <Table
              rowKey={(record, index) => {
                return index + ''
              }}
              columns={[{
                dataIndex: 'orderCode',
                title: '已完成售后单号'
              },{
                dataIndex: 'refundTypeDesc',
                title: '售后类型'
              },{
                dataIndex: 'refundAmount',
                title: '售后金额',
                render: (text) => {
                  return APP.fn.formatMoneyNumber(text, 'm2u')
                }
              }]}
              dataSource={afterSales}
              pagination={false}
            >
            </Table>
          </div>
          <div className='mt10 mb10'><b>层级关系图</b></div>
          <Tier dataSource={tier} />
          <div className='mt10 mb10'>
            <b>收益汇总信息</b>
            <div>
              总收益 {APP.fn.formatMoneyNumber(detail.totalAmount, 'm2u')} 已到账 {APP.fn.formatMoneyNumber(detail.settledAmount, 'm2u')} 未到账 {APP.fn.formatMoneyNumber(detail.unSettledAmount, 'm2u')}
            </div>
          </div>
          <Table
            rowKey={record => record.id}
            columns={this.columns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ y: 540 }}
          />
        </Form>
      </div>
    )
  }
}
export default Main
