import React, { Component } from 'react'
import moment from 'moment'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { formatMoneyWithSign } from '@/pages/helper'
import If from '@/packages/common/components/if'
import SearchFetch from '@/components/search-fetch'
import { Tabs, Card, Button, Pagination } from 'antd'
import Countdown from '../components/countdown/index'
import { getFieldsConfig } from './config'
import styles from './style.m.styl'

import * as api from './api'
const { TabPane } = Tabs

interface State {
  type: string
  dataSource: []
  total: number
  current: number
  pageSize: number
}

class Order extends Component<any, State> {
  public form: FormInstance
  constructor (props: any) {
    super(props)
    this.state = {
      type: 'ALL',
      dataSource: [],
      total: 0,
      current: 1,
      pageSize: 10
    }
  }
  /**
   * 订单tabs切换更新type
   *
   * @memberof Order
   */
  public handleTabChange = (type: string) => {
    this.setState({
      type
    }, () => this.fetchData())
  }
  /**
   *请求列表
  * @memberof Order
  */
  public fetchData () {
    const { type, current, pageSize } = this.state
    const formData = this.form.getValues()
    let refundStatusList: any = []
    // 如果是取消和关闭，需要传递两个值，其他状态转化一下type
    if (type === 'closeAndCancel') {
      refundStatusList = refundStatusList.concat([40, 50])
    } else if (type === 'ALL') {
      refundStatusList = formData.refundStatus ? refundStatusList.concat([Number(formData.refundStatus)])
        : refundStatusList
    } else {
      refundStatusList = refundStatusList.concat([Number(type)])
    }

    api.fetcOrderList({
      refundStatusList: refundStatusList,
      ...formData,
      pageNo: current,
      pageSize
    }).then((res: any) => {
      this.setState({
        dataSource: res.result || [],
        total: res.total
      })
    })
  }

  /**
   * 导出售后单列表
   *
   * @memberof Order
   */
  public toExport () {
    const { type, current, pageSize } = this.state
    api.exportOrderList({
      refundStatus: type,
      ...this.form.getValues(),
      pageNo: current,
      pageSize
    }).then((res: any) => {
      console.log(res, 'toExport')
    })
  }

  /**
   * 重置from数据
   *
   * @memberof Order
   */
  public resetFrom () {
    this.form.resetValues()
  }

  public toSearch = () => {
    this.fetchData()
  }
  public render () {
    const { type, dataSource, current, total, pageSize } = this.state
    return (
      <Card className={styles.list}>
        <div>
          <Tabs activeKey={`${type}`} onChange={this.handleTabChange}>
            <TabPane tab='全部' key='ALL' />
            <TabPane tab='待审核' key='10' />
            <TabPane tab='待返回仓库' key='24' />
            <TabPane tab='已完成' key='30' />
            <TabPane tab='关闭/取消' key='closeAndCancel' />
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
            <If condition={type !== '10' && type !== '24'}>
              <FormItem name='refundType' />
            </If>
            <FormItem name='createTime' />
          </Form>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => this.toSearch()} type='primary' className='mr10'>查询</Button>
            <Button onClick={() => this.resetFrom()} className='mr10'>重置</Button>
            <Button type='primary' onClick={() => this.toExport()}>导出售后单</Button>
          </div>
        </div>
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
              {
                dataSource.map((order: any, index) => {
                  return (
                    <React.Fragment key={index}>
                      <tr>
                        <td className={styles['order-resume']} colSpan={9}>
                          <span>售后单编号：{order.refundCode}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                          <span>订单编号：{order.childOrderCode}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                          <span>申请时间：{order.createTime && moment(order.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                          <If condition={order.refundStatus === 10}>
                            <span>
                              售后审核倒计时：
                              <Countdown value={order.countdown / 1000 }></Countdown>
                            </span>
                          </If>
                        </td>
                      </tr>
                      <tr>
                        {/* 商品信息 */}
                        <td>
                          {order.productId}
                        </td>
                        <td>
                          <div>
                            商品名称:{order.skuName}
                          </div>
                          <div>
                            规格:{order.properties}
                          </div>
                        </td>
                        <td>
                          {order.refundType === 10 ? '退货退款' : order.refundType === 20 ? '仅退款' : ''}
                        </td>
                        <td>
                          {order.refundStatusDesc}
                        </td>
                        <td>
                          {order.refundNumber}
                        </td>
                        <td>
                          {formatMoneyWithSign(order.refundAmount)}
                        </td>
                        <td>
                          {order.selfDeliveryPointName}
                        </td>
                        <td>
                          {order.contactName} {order.contactPhone}
                        </td>
                        <td>
                          <Button
                            type='link'
                            href={window.location.pathname + `#/fresh/saleAfter/detail/${order.refundCode}`}
                            target='_blank'>
                              查看详情
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.empty} colSpan={9}></td>
                      </tr>
                    </React.Fragment>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        <div>
          <Pagination
            showQuickJumper
            showTotal={() => {
              return `共计 ${total} 条`
            }}
            style={{
              marginTop: 10,
              float: 'right'
            }}
            onChange={(page) => {
              this.setState({
                current: page
              }, () => {
                this.fetchData()
              })
            }}
            pageSize={pageSize}
            current={current}
            total={total}
          />
        </div>
      </Card>
    )
  }
}

export default Order
