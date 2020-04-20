import React, { Component } from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { Tabs, Card, Row, Col, Button } from 'antd'
import { detailTabHear, auditAfterInfoTemplate, applyInfoTemplate, orderInfo, AuditTemplate } from './components'
const { TabPane } = Tabs
import style from './style.m.styl'

interface State {
  type: string
  dataSource: []
}

class Order extends Component<any, State> {
  public form: FormInstance
  public columns: [] = [

  ]
  constructor (props: any) {
    super(props)
    this.state = {
      type: 'detail',
      dataSource: []
    }
  }
  public handleTabChange = (type: string) => {
    this.setState({
      type
    })
  }
  public render () {
    const { type, dataSource } = this.state
    return (
      <div>
        <Tabs activeKey={`${type}`} onChange={this.handleTabChange}>
          <TabPane className={style['detail-tab']} tab='售后详情' key='detail'>
            {detailTabHear()}
            {auditAfterInfoTemplate()}
            {applyInfoTemplate()}
            {orderInfo()}
            <AuditTemplate></AuditTemplate>
          </TabPane>
          <TabPane tab='信息记录' key='record'>
            <table className={style.table}>
              <thead>
                <tr>
                  <th>
                    操作
                  </th>
                  <th>
                    内容
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>创建售后订单</td>
                  <td>XXX创建售后订单</td>
                </tr>
                <tr>
                  <td>取消售后</td>
                  <td>XXXX取消订单</td>
                </tr>
              </tbody>
            </table>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Order
