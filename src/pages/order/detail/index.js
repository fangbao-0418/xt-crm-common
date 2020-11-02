import React, { Component } from 'react'
import { push1688, withhold, getProceedsListByOrderId, cancelIntercept } from '../api'
import { get, map } from 'lodash'
import { Button, Row, Card, Col, message, Modal, Divider } from 'antd'
import BuyerInfo from './buyer-info'
import OrderInfo from './order-info'
import GoodsTable from './goods-table'
import BenefitInfo from './benefit-info'
import HaodianBenefitInfo from './HaodianBenefitInfo'
import StepInfo from './step-info'
import { enumOrderStatus, OrderStatusTextMap } from '../constant'
import DeliveryModal from './components/delivery-modal'
import { dateFormat } from '@/util/utils'
import moment from 'moment'
import WithModal from './components/modal'
import ModifyAddress from './components/modifyAddress'
import { namespace } from './model'
import { connect } from 'react-redux'
import If from '@/packages/common/components/if'

/**
 * 海淘状态
 * 10-用户已下单，20-订单提交中，21-订单提交失败，22-订单提交成功，30-支付单提交中，31-支付提交失败，
 * 32-支付单提交成功，40-已推送保税仓，41-推送保税仓失败，50-海关清关中，51-海关清关失败，60-保税仓准备中，70-保税仓已发货
 */
const globalOrderStatusConfig = {
  '10': '用户已下单',
  '20': '订单提交中',
  '21': '订单提交失败',
  '22': '订单提交成功',
  '30': '支付单提交中',
  '31': '支付提交失败',
  '32': '支付单提交成功',
  '40': '已推送保税仓',
  '41': '推送保税仓失败',
  '50': '海关清关中',
  '51': '海关清关失败',
  '60': '保税仓准备中',
  '70': '保税仓已发货'
}

/**
 * 订单推送海关状态
 */
const orderPushCustomsStatusConfig = {
  '1': '未推送',
  '2': '已推送',
  '3': '处理成功',
  '4': '处理失败'
}

/**
 * 支付单推送状态
 */
const paymentPushCustomsStatusConifg = {
  '1': '未推送',
  '2': '已推送属地',
  '3': '处理成功',
  '4': '处理失败',
  '5': '已推送总署'
}
const { confirm } = Modal

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

  /**
   * 推送到1688
   * @param {string} id 订单Id
   */
  push1688 (id) {
    if (this.pushload) {
      return
    }
    this.pushload = true
    push1688(id).then(res => {
      if (res.success) {
        message.success('操作成功')
      } else {
        message.error(res.message)
      }
    }).finally(() => {
      this.pushload = false
    })
  }

  /**
   * 发起代扣
   * @param {string} id 订单Id
   */
  withhold (id) {
    if (this.holdload) {
      return
    }
    this.holdload = true
    withhold(id).then(res => {
      if (res && res.success) {
        message.success('操作成功')
      } else {
        message.error(res.message)
      }
    }).finally(() => {
      this.holdload = false
    })
  }

  /**
   * 确认发起代扣弹窗
   * @param {string} id 订单Id
   */
  comfirmWithhold = (id) => {
    confirm({
      title: '确认重新发起代扣?',
      onOk () {
        this.withhold(id)
      }
    })
  }

  /**
   * 确认推送1688弹窗
   * @param {string} id 订单Id
   */
  comfirmPush1688 = (id) => {
    confirm({
      title: '确认重新推送1688?',
      onOk () {
        this.push1688(id)
      }
    })
  }

  // 修改收货地址弹窗
  changeModifyAddress = (isOk) => {
    this.setState({
      modifyAddressVisible: !this.state.modifyAddressVisible
    }, () => {
      isOk && this.query()
    })
  }

  render () {
    const { data, childOrderList } = this.props
    const {
      userProceedsListByOrderId,
      goodsTableKey,
      deliveryVisible,
      deliveryData,
      modifyAddressVisible
    } = this.state
    const orderStatus = get(data, 'orderInfo.orderStatus', enumOrderStatus.Unpaid)
    const orderType = get(data, 'orderInfo.orderType')
    const orderStatusLogList = get(data, 'orderStatusLogList', [])
    const showFlag = !!data.orderGlobalExtendVO
    const orderGlobalExtendVO = Object.assign({}, data.orderGlobalExtendVO)
    console.log(data.orderInfo, 'data.orderInfo')
    return (
      <>
        <StepInfo
          orderType={orderType}
          orderStatus={orderStatus}
          orderStatusLogList={orderStatusLogList}
        />
        {/* 订单信息 */}
        <OrderInfo orderVirtualInfoVO={data.orderVirtualInfoVO} orderInfo={data.orderInfo} buyerInfo={data.buyerInfo} changeModifyAddress={this.changeModifyAddress} />
        {/* 支付信息 */}
        <BuyerInfo buyerInfo={data.buyerInfo} orderInfo={data.orderInfo} freight={data.freight} totalPrice={data.totalPrice} />
        {/* 海关信息 */}
        <Card title='海关信息' hidden={!showFlag}>
          <Row gutter={24}>
            <Col span={8}>海淘状态：{globalOrderStatusConfig[orderGlobalExtendVO.globalOrderStatus]}</Col>
            <Col span={8}>清关完成时间：{!!orderGlobalExtendVO.customsClearanceTime && APP.fn.formatDate(orderGlobalExtendVO.customsClearanceTime)}</Col>
            <Col span={8}>OMS作业单号：{orderGlobalExtendVO.omsOrderCode}</Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>订单报文：{orderPushCustomsStatusConfig[orderGlobalExtendVO.orderPushCustomsStatus]}
              <Button type='link'
                onClick={() => {
                  this.props.modal.show({
                    type: 'orderMessage',
                    title: '订单报文详情',
                    ...orderGlobalExtendVO
                  })
                }}>
                查看详情
              </Button>
            </Col>
            <Col span={8}>支付单报文：{paymentPushCustomsStatusConifg[orderGlobalExtendVO.paymentPushCustomsStatus]}
              <Button
                type='link'
                onClick={() => {
                  this.props.modal.show({
                    type: 'payMessage',
                    title: '支付单报文详情',
                    ...orderGlobalExtendVO
                  })
                }}>
                查看详情
              </Button>
            </Col>
          </Row>
        </Card>
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
                  //充值信息
                  orderVirtualInfoVO={data.orderVirtualInfoVO}
                  query={this.query}
                  memberId={data.buyerInfo && data.buyerInfo.memberAddress && data.buyerInfo.memberAddress.memberId}
                  showModal={this.showModal}
                  tableTitle={
                    <div style={{ fontWeight: 'bold' }}>
                      <Row gutter={24}>
                        <Col span={8}>
                          <span>子订单号{index + 1}: </span>
                          <span>{item.childOrder.orderCode}</span>
                          <span> {Number(item.childOrder.interceptorType) === 10 ? '(拦截订单)' : ''}</span>
                        </Col>
                        <Col span={8}>
                          <span>订单状态：</span>
                          <span>
                            {OrderStatusTextMap[item.childOrder.orderStatus]}
                          </span>
                          <span>
                            {
                              (item.childOrder.orderStatus === enumOrderStatus.Intercept && item.childOrder.interceptorTimeOut)
                                ? `(${moment(item.childOrder.interceptorTimeOut).format(dateFormat)})`
                                : ''
                            }
                          </span>
                        </Col>
                        <Col className='gutter-row' span={8} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ marginRight: 30 }}>发货模式：{item.childOrder.deliveryModeName}</span>
                            {item.childOrder.shippedWarehouseName && <span>仓库：{item.childOrder.shippedWarehouseName}</span>}
                          </div>
                          <span>
                            { /**
                               * 海淘子订单的发货按钮去掉
                               * 订单状态（10：待付款；20：待发货；30：已发货；40：已收货; 50完成; 60关闭）
                               * 当订单状态orderStatus >= 20 && orderStatus <= 50
                               */
                              (Number(item.childOrder.orderType) !== 70
                              && orderStatus >= enumOrderStatus.Undelivered
                              && orderStatus <= enumOrderStatus.Complete
                              && data.orderInfo?.orderType !== 56) && ( // 订单类型 56: 虚拟-直播间红包充值
                                <Button
                                  type='primary'
                                  onClick={() => this.changeModal(true, item)}>
                                  发货
                                </Button>
                              )
                            }
                            {
                              (item.childOrder.interceptorType === 10 && (
                                item.childOrder.orderStatus === enumOrderStatus.Undelivered
                                || item.childOrder.orderStatus === enumOrderStatus.Delivered)
                              ) && (
                                <Button
                                  type='primary'
                                  style={{ marginLeft: 8 }}
                                  onClick={() => this.cancelInterceptor(item)}
                                >
                                  取消拦截发货
                                </Button>
                              )}
                            {item.canProtocolPay ? <Button
                              type='primary'
                              style={{ margin: '0 10px 10px 0' }}
                              onClick={() => this.comfirmWithhold(item.childOrder.id)}
                            >重新发起代扣
                            </Button> : ''}
                            {item.canPush ? <Button
                              style={{ margin: '0 10px 10px 0' }}
                              type='primary'
                              onClick={() => this.comfirmPush1688(item.childOrder.id)}
                            >重新推送1688
                            </Button> : ''}
                          </span>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={8}>供应商：{item.childOrder.storeName}</Col>
                        {/* <Col span={8}>供应商类型：{storeType[item.childOrder.category]}</Col> */}
                        <Col span={8}>供应商类型：{item.childOrder.storeTypeStr}</Col>
                        <If condition={item.childOrder.liveId > 0}>
                          <Col span={4}>供应商订单号：{item.childOrder.storeOrderId || '无'}</Col>
                          <Col span={4}>直播间ID：{item.childOrder.liveId}</Col>
                        </If>
                        <If condition={item.childOrder.liveId <= 0}>
                          <Col span={8}>供应商订单号：{item.childOrder.storeOrderId || '无'}</Col>
                        </If>
                        <Col span={8}>供应商电话：{item.childOrder.storePhone || '无'}</Col>
                        <Col span={8}>
                          运费险：
                          <span
                            className='href'
                            onClick={() => {
                              APP.history.push(`/service/freight-insurance?childOrderCode=${item.childOrder.orderCode}`)
                            }}
                          >
                            {item?.freightInsuranceVO?.insuranceStatusStr}
                        </span>
                      </Col>
                      </Row>
                      <Row>
                        {
                          item.childOrder.interceptorType === 10
                            && (
                              <>
                                <Col span={8}>拦截人：{item.childOrder.interceptorMemberName}</Col>
                                <Col span={8}>拦截人手机号：{item.childOrder.interceptorMemberPhone}</Col>
                              </>
                            )
                        }
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
          {data?.orderInfo && Number(data.orderInfo.orderBizType) !== 30 ? (
            <BenefitInfo
              key={`benefit-${goodsTableKey}`}
              data={data.orderYield}
              orderInfo={data.orderInfo}
              proceedsList={userProceedsListByOrderId}
              refresh={this.queryProceeds}
            />
          ): (
            <HaodianBenefitInfo orderInfo={data.orderInfo}/>
          )}
        </Card>
        <DeliveryModal
          type='add'
          title='发货'
          visible={deliveryVisible}
          mainorderInfo={data.orderInfo}
          onSuccess={this.onOk}
          orderId={(deliveryData.childOrder || {}).id}
          logistics={deliveryData.logistics}
          onCancel={() => this.changeModal(false)}
        />
        <ModifyAddress
          title='修改订单信息'
          visible={modifyAddressVisible}
          onCancel={this.changeModifyAddress}
          buyerInfo={data.buyerInfo}
          orderInfo={data.orderInfo}
        />
      </>
    )
  }

  cancelInterceptor = ({
    childOrder
  }) => {
    console.log(childOrder)
    cancelIntercept({ interceptOrderId: childOrder.interceptorOrderRecordId, memberId: childOrder.interceptorMemberId }).then((res) => {
      if (res) {
        message.success('取消成功')
        this.query()
      }
    })
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
