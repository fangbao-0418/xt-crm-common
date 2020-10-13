import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import styles from './styles.module.styl'
import { Row, Col, Table } from 'antd'

interface Props {
  detail: any
}
class Main extends React.Component<Props, {}> {
  public form: FormInstance
  public componentDidMount () {
    const { detail } = this.props
    console.log('detail', detail)
    this.form.setValues(detail.orderDetailVO)
  }
  public render () {
    const { detail } = this.props
    const { afterSaleProportion, ...item } = detail.priceSnapShotVO
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16}
    }
    return (
      <div className={styles['earnings-detail']}>
        <Form
          formItemStyle={{margin: 0}}
          getInstance={(ref) => this.form = ref}
          readonly
        >
          <FormItem label='主订单号' name='mainOrderCode' />
          <FormItem label='商品名称' name='productName' />
          <FormItem label='购买数量' name='num' />
          <FormItem label='商品实付金额' name='childPayAmount' />
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label='下单人昵称' name='buyer.nickName' />
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label='收益人昵称' name='receiptor.nickName' />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label='下单人用户ID' name='buyer.memberId' />
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label='收益人用户ID' name='receiptor.memberId' />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label='下单人手机' name='buyer.phone' />
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label='受益人手机' name='receiptor.phone' />
            </Col>
          </Row>
          <div>
            <div className='mt10 mb10'><b>层级价格快照</b></div>
            <Table
              rowKey={(record, index) => {
                return index + ''
              }}
              columns={[{
                title: '售价',
                dataIndex: 'amount',
                render: (text) => APP.fn.formatMoneyNumber(text, 'm2u')
              }, {
                title: '结算价',
                dataIndex: 'amount',
                render: (text) => APP.fn.formatMoneyNumber(text, 'm2u')
              }, {
                title: '代理总佣金',
                dataIndex: 'amount',
                render: (text) => APP.fn.formatMoneyNumber(text, 'm2u')
              }]}
              dataSource={[item]}
              pagination={false}
            />
          </div>
          <div>
            <div className='mt10 mb10'>
              <b>售后信息：收益售后扣除比例{APP.fn.formatMoneyNumber(afterSaleProportion)}%</b>
            </div>
            <Table
              rowKey={(record, index) => {
                return index + ''
              }}
              columns={[{
                title: '已完成售后单号',
                dataIndex: 'afterSaleOrderCode'
              }, {
                title: '售后类型',
                dataIndex: 'afterSaleTypeDesc'
              }, {
                title: '售后金额',
                dataIndex: 'afterSaleAmount',
                render: (text) => APP.fn.formatMoneyNumber(text, 'm2u')
              }]}
              dataSource={detail.priceSnapShotVO.afterSaleList}
              pagination={false}
            />
          </div>
          <div className='mt10 mb10'><b>层级关系图</b></div>
        </Form>
      </div>
    )
  }
}

export default Main