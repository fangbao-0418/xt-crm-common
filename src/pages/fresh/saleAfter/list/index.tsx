import React, { Component } from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import Img from '@/components/Image'
import If from '@/packages/common/components/if'
import SearchFetch from '@/components/search-fetch'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import SelectFetch from '@/packages/common/components/select-fetch'
import { Tabs, Card, Button } from 'antd'
import { getFieldsConfig } from './config'
import styles from './style.m.styl'

import * as api from './api'
const { TabPane } = Tabs

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
      type: 'ALL',
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
      <div className={styles.list}>
        <Card>
          <Tabs activeKey={`${type}`} onChange={this.handleTabChange}>
            <TabPane tab='全部' key='ALL' />
            <TabPane tab='待审核' key='10' />
            <TabPane tab='处理中' key='20' />
            <TabPane tab='已完成' key='30' />
            <TabPane tab='关闭/取消' key='40' />
          </Tabs>
          <Form
            layout='inline'
            namespace='afterSale'
            config={getFieldsConfig()}
            rangeMap={{
              createTime: {
                fields: ['createTimeBegin', 'createTimeEnd']
              }
            }}
            size='small'
            getInstance={(ref) => {
              this.form = ref
            }}
          >
            <If condition={type === 'ALL'}>
              <FormItem name='refundStatus' />
            </If>
            <FormItem
              label='门店名称'
              inner={
                (from) => {
                  return (
                    <div style={{ width: '200px' }}>
                      {
                        from.getFieldDecorator('selfDeliveryPointId')(
                          <SearchFetch
                            placeholder='请输入门店名称'
                            api={api.searchPoints}
                            reserveKey='after-sale-selfDeliveryPointIdStr'
                          />
                        )
                      }
                    </div>
                  )
                }
              }
            />
            <FormItem name='refundCode' />
            <FormItem name='childOrderCode' />
            <FormItem name='productName' />
            <FormItem name='contactPhone' />
            <FormItem name='backStore' />
            <FormItem name='createTime' />
          </Form>
          <div style={{ textAlign: 'right' }}>
            <Button type='primary' className='mr10'>查询</Button>
            <Button className='mr10'>重置</Button>
            <Button type='primary'>导出售后单</Button>
          </div>
        </Card>
        <div className='mt10'>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>商品ID</th>
                <th>商品名称</th>
                <th>售后类型</th>
                <th>售后状态</th>
                <th>申请售后数目</th>
                <th>申请售后金额</th>
                <th>所属门店</th>
                <th>买家信息</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {/* {
                dataSource.map((order, index) => {
                  return (
                    <React.Fragment key={index}> */}
              <tr>
                <td className={styles['order-resume']} colSpan={9}>
                  <span>售后单编号：</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>订单编号：</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>申请时间：</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>售后审核倒计时：</span>
                </td>
              </tr>
              <tr>
                {/* 商品信息 */}
                <td>
                  {/* {order.productId} */}
                  ID1232323
                </td>
                <td>
                  我是商品名称
                </td>
                {/* 单价 */}
                <td>
                  售后类型
                </td>
                {/* 数量 */}
                <td>
                  什么状态
                </td>
                {/* 订单总额 */}
                <td>
                  数目
                </td>
                {/* 收件人/收件人手机 */}
                <td>
                  金额
                </td>
                {/* 订单状态 */}
                <td>
                  什么门店
                </td>
                <td>
                  信息
                </td>
                <td>
                  各种操作
                </td>
              </tr>
              {/* </React.Fragment>
                  )
                })
              } */}
              <tr>
                <td className={styles.empty} colSpan={9}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Order
