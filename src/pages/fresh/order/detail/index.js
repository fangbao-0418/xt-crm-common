import React, { Component } from 'react'
import { getProceedsListByOrderId } from '../api'
import { get, map } from 'lodash'
import { Row, Card, Col, Divider } from 'antd'
import BuyerInfo from './buyer-info'
import OrderInfo from './order-info'
import GoodsTable from './goods-table'
import BenefitInfo from './benefit-info'
import StepInfo from './step-info'
import { enumOrderStatus, OrderStatusTextMap, storeType } from '../constant'
import { dateFormat } from '@/util/utils'
import moment from 'moment'
import WithModal from './components/modal'
import { namespace } from './model'
import { connect } from 'react-redux'
import If from '@/packages/common/components/if'
@connect((state) => ({
  data: state[namespace].data,
  childOrderList: state[namespace].childOrderList
}))
class Detail extends Component {
  get id () {
    const {
      match: {
        params: { id }
      }
    } = this.props
    return id
  }

  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      remark: '',
      userProceedsListByOrderId: [],
      goodsTableKey: 0,
      deliveryVisible: false,
      deliveryData: {},
      modifyAddressVisible: false
    }
  }

  componentDidMount () {
    this.query()
  }

  /**
   * 查询订单详情信息
   */
  query = () => {
    APP.dispatch({
      type: `${namespace}/fetchDetail`,
      payload: {
        orderCode: this.id
      }
    })
    this.queryProceeds()
  }

  /**
   * 查询订单整单收益信息
   */
  queryProceeds = () => {
    getProceedsListByOrderId({ orderCode: this.id }).then((result) => {
      const { goodsTableKey } = this.state
      this.setState({
        userProceedsListByOrderId: result,
        goodsTableKey: goodsTableKey + 1
      })
    })
  }

  render () {
    const { data, childOrderList } = this.props
    const {
      userProceedsListByOrderId,
      goodsTableKey
    } = this.state
    const orderStatus = get(data, 'orderInfo.orderStatus', enumOrderStatus.Unpaid)
    const orderStatusLogList = get(data, 'orderStatusLogList', [])
    return (
      <>
        <StepInfo
          orderStatus={orderStatus}
          orderStatusLogList={orderStatusLogList}
        />
        {/* 订单信息 */}
        <OrderInfo orderInfo={data.orderInfo} buyerInfo={data.buyerInfo} changeModifyAddress={this.changeModifyAddress} />
        {/* 支付信息 */}
        <BuyerInfo buyerInfo={data.buyerInfo} orderInfo={data.orderInfo} freight={data.freight} totalPrice={data.totalPrice} />
        <Card title='详细信息'>
          {map(childOrderList, (item, index) => {
            return (
              <div
                key={item.childOrder.orderCode}
              >
                <GoodsTable
                  key={index}
                  list={item.skuList}
                  childOrder={item.childOrder}
                  orderInfo={data.orderInfo}
                  logistics={item.logistics}
                  query={this.query}
                  memberId={data.buyerInfo && data.buyerInfo.memberAddress && data.buyerInfo.memberAddress.memberId}
                  showModal={this.showModal}
                  tableTitle={
                    <div style={{ fontWeight: 'bold' }}>
                      <Row gutter={24}>
                        <Col span={8}>
                          <span>子订单号{index + 1}: </span>
                          <span>{item.childOrder.orderCode}</span>
                        </Col>
                        <Col span={8}>
                          <span>订单状态：</span>
                          <span>
                            {OrderStatusTextMap[item.childOrder.orderStatus]}
                          </span>
                          <span>
                            {
                              (item.childOrder.orderStatus == enumOrderStatus.Intercept && item.childOrder.interceptorTimeOut)
                                ? `(${moment(item.childOrder.interceptorTimeOut).format(dateFormat)})`
                                : ''
                            }
                          </span>
                        </Col>
                        <Col className='gutter-row' span={8}>
                          <span style={{ marginRight: 30 }}>发货模式：{item.childOrder.deliveryModeName}</span>
                          <span>提货方式：{item.childOrder.extractModeStr}</span>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={8}>供应商：{item.childOrder.storeName}</Col>
                        <Col span={8}>供应商类型：{storeType[item.childOrder.category]}</Col>
                        <If condition={item.childOrder.liveId > 0}>
                          <Col span={4}>供应商订单号：{item.childOrder.storeOrderId || '无'}</Col>
                          <Col span={4}>直播间ID：{item.childOrder.liveId}</Col>
                        </If>
                        <If condition={item.childOrder.liveId <= 0}>
                          <Col span={8}>供应商订单号：{item.childOrder.purchaseSentSn || '无'}</Col>
                        </If>
                      </Row>
                      <Row gutter={24}>
                        <Col span={8}>门店名称：{item.childOrder.selfDeliveryPointName}</Col>
                        <Col span={8}>门店电话：{item.childOrder.selfDeliveryPointTel}</Col>
                        <Col span={8}>门店地址：{item.childOrder.selfDeliveryAddress}</Col>
                      </Row>
                    </div>
                  }
                />
                {childOrderList.length > 1 && index < childOrderList.length - 1 ? <Divider /> : null}
              </div>
            )
          })}
        </Card>
        <Card title='整单收益信息'>
          <BenefitInfo
            key={`benefit-${goodsTableKey}`}
            data={data.orderYield}
            orderInfo={data.orderInfo}
            proceedsList={userProceedsListByOrderId}
            refresh={this.queryProceeds}
          />
        </Card>
      </>
    )
  }

  onOk = () => {
    this.setState({
      deliveryVisible: false
    }, () => {
      this.query()
    })
  }

  changeModal = (visible, data) => {
    this.setState({
      deliveryVisible: visible,
      deliveryData: data || {}
    })
  }
}

export default WithModal(Detail)
