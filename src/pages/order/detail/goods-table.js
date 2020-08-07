import React, { Component } from 'react'
import { Table, Row, Col, Button, Modal, Input, message, Divider } from 'antd'
import { formatMoney } from '@/packages/common/utils'
import ApplyAfterSaleModal from '../components/modal/ApplyAfterSale'
import Compensate from '../components/modal/Compensate'
import { withRouter } from 'react-router'
import { getDetailColumns } from '../constant'
import LogisticsInfo from './logistics-info'
import ChildOrderBenefitInfo from './child-order-benefit-info'
import { formatDate } from '../../helper'
import { setOrderRemark, setRefundOrderRemark, getProceedsListByOrderIdAndSkuId } from '../api'
import alert from '@/packages/common/components/alert'
import * as adapter from './adapter'
@withRouter
class GoodsTable extends Component {
  state = {
    visible: false, // 申请售后模态框visible
    compensateVisible: false, // 补偿模态框visible
    notesVisible: false, // 添加备注模态框
    modalInfo: {},
    proceedsVisible: false, // 查看收益信息
    childOrderProceeds: [],
    skuInfo: {}
  }
  /**
   * 是否显示申请售后按钮
   * orderType 订单类型（0：普通订单，10：激活码订单，20：地推订单，30：助力分兑换订单，50：买赠订单，60：线下团购会订单）
   * orderStatus 订单状态（10：待付款；20：待发货；25：部分发货； 30：已发货；40：已收货; 50完成; 60关闭）
   */
  showApplyBtn = (orderStatus, orderType) => {
    return orderType !== 50 && orderType !== 60 && [20, 25, 30, 40, 50].includes(orderStatus)
  }
  /**
   * 如果是海淘订单，需要提示该订单商品为海淘商品，请慎重处理售后
   */
  handleApply = (record) => {
    const handle = () => {
      const { orderInfo = {}, childOrder = {}, memberId } = this.props
      if (record.canApply) {
        this.setState({
          modalInfo: {
            ...record,
            mainOrderId: orderInfo.id,
            memberId,
            childOrder
          },
          visible: true
        })
      } else {
        Modal.confirm({
          title: '系统提示',
          content: record.errormsg,
          okText: '查看详情',
          cancelText: '取消',
          onOk: () => {
            APP.history.push(`/order/refundOrder/${record.skuServerId}`)
          }
        })
      }
    }
    if (this.props.childOrder && Number(this.props.childOrder.orderType) !== 70) {
      handle()
    } else {
      this.props.alert({
        content: '该订单商品为海淘商品，请慎重处理售后',
        onOk: (hide) => {
          hide()
          handle()
        }
      })
    }
  }
  handleCompensate = (record) => {
    const { orderInfo = {}, childOrder = {} } = this.props
    if (!record.isHasDoingCompensate) {
      this.setState({
        modalInfo: {
          orderInfo,
          childOrderInfo: childOrder,
          skuInfo: record
        },
        compensateVisible: true
      })
    } else {
      Modal.confirm({
        title: '系统提示',
        content: '该订单商品正在补偿中，无法发起新补偿',
        okText: '查看详情',
        cancelText: '取消',
        onOk: () => {
          APP.history.push(`/order/compensate-order/${record.skuServerId}`)
        }
      })
    }
  }
  handleInputChange = e => {
    this.setState({
      remark: e.target.value
    })
  }
  lookForHistory = ({ orderCode, productId }) => {
    const { history } = this.props
    history.push(`/order/refundOrder?mainOrderCode=${orderCode}&productId=${productId}`)
  }
  handleAddNotes = () => {
    const { modalInfo } = this.state
    const params = {
      orderCode: this.props.match.params.id,
      refundId: modalInfo.refundId,
      childOrderId: modalInfo.childOrderId,
      info: this.state.remark
    }
    const apiFunc = modalInfo.refundId ? setRefundOrderRemark : setOrderRemark
    apiFunc(params).then((res) => {
      res && message.success('添加备注成功')
      this.props.query()
      this.setState({
        notesVisible: false
      })
    })
  }

  /**
   * 展示/收起子订单收益列表
   */
  childOrderProceeds = (skuInfo, currentVisible) => {
    const { orderInfo = {} } = this.props
    const { skuId } = skuInfo
    if (currentVisible) {
      this.setState({
        proceedsVisible: false
      })
    } else {
      getProceedsListByOrderIdAndSkuId({ orderCode: orderInfo.orderCode, skuId }).then((result) => {
        this.setState({
          skuInfo,
          proceedsVisible: true,
          childOrderProceeds: result || []
        })
      })
    }
  }

  render () {
    const { tableTitle } = this.props
    const { proceedsVisible, childOrderProceeds, skuInfo } = this.state
    const orderInfo = this.props.orderInfo || {}
    const childOrder = this.props.childOrder || {}
    const list = this.props.list || []
    const logistics = this.props.logistics || {}
    const orderVirtualInfoVO= this.props.orderVirtualInfoVO || {}
    console.log('orderInfo')
    console.log(orderInfo)
    const columns = [
      ...(getDetailColumns(0, orderInfo.isShop === 1).filter(item => item.key !== 'storeName')),
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width: 130,
        render: (text, record, index) => (
        //orderType===55虚拟商品
          <>
            <div>
              {this.showApplyBtn(orderInfo.orderStatus, record.orderType)&& record.orderType!==55 && (
                <Button
                  style={{ padding: 0 }}
                  type='link'
                  size='small'
                  onClick={() => this.handleApply(record)}>
                  申请售后
                </Button>
              )}
            </div>
            <div>
              <Button
                style={{ padding: 0 }}
                type='link'
                size='small'
                onClick={() => this.setState({
                  notesVisible: true,
                  modalInfo: { ...record }
                })}>
                添加备注
              </Button>
            </div>
            <div>
              {record.canShowHistoryBtn && (
                <Button
                  style={{ padding: 0 }}
                  type='link'
                  size='small'
                  onClick={() => this.lookForHistory({ ...record, orderCode: orderInfo.orderCode })}>
                  历史售后
                </Button>
              )}
            </div>
            <div>
              <Button
                style={{ padding: 0 }}
                type='link'
                size='small'
                onClick={() => this.handleCompensate(record)}>
                发起补偿
              </Button>
            </div>
            {
              childOrder.canShowHistoryBtn && (
                <div>
                  <Button
                    style={{ padding: 0 }}
                    type='link'
                    size='small'
                    onClick={() => {
                      this.props.history.push(`/order/compensate-order?childOrderCode=${childOrder.orderCode}`)
                    }}>
                    补偿历史
                  </Button>
                </div>
              )
            }
            <div>
              <Button
                style={{ padding: 0 }}
                type='link'
                size='small'
                onClick={() => this.childOrderProceeds(record, proceedsVisible)}>
                {proceedsVisible ? '收起收益' : '查看收益'}
              </Button>
            </div>
          </>
        )
      }
    ]
    return (
      <>
        {this.state.modalInfo.mainOrderId
          && this.state.modalInfo.skuId
          && <ApplyAfterSaleModal
            onCancel={() => this.setState({ visible: false })}
            successCb={() => this.setState({ visible: false }, this.props.query)}
            visible={this.state.visible}
            modalInfo={this.state.modalInfo} />}
        {
          this.state.modalInfo.orderInfo
          && <Compensate
            onCancel={() => this.setState({ compensateVisible: false })}
            successCb={() => this.setState({ compensateVisible: false })}
            visible={this.state.compensateVisible}
            modalInfo={this.state.modalInfo}
          />
        }
        <Modal
          title='添加备注'
          visible={this.state.notesVisible}
          onOk={this.handleAddNotes}
          onCancel={() => this.setState({ notesVisible: false })}
        >
          <Input
            value={this.state.remark}
            placeholder='请输入备注'
            onChange={this.handleInputChange}
          />
        </Modal>
        <div>
          <div>
            <Table
              bordered
              rowKey={record => record.skuId}
              columns={columns}
              dataSource={adapter.filterChildOrderData(list, childOrder.orderStatus)}
              pagination={false}
              title={() => tableTitle}
              footer={() => {
                return (
                  <>
                    <Row style={{ marginBottom: 20 }}>
                      <Col style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 'bold' }}></span>
                        <span className='mr10'>运费合计：<font color='red'>{formatMoney(childOrder.originFreight)}</font></span>
                        <span className='mr10'>运费优惠：<font color='red'>{formatMoney(-(childOrder.couponFreight))}</font></span>
                        <span>运费实付：{formatMoney(childOrder.payFreight)}</span>
                      </Col>
                    </Row>
                    {
                      proceedsVisible && (
                        <Row style={{ marginBottom: 20 }}>
                          <Col>
                            <span style={{ fontWeight: 'bold' }}>SKU收益：</span>
                            <ChildOrderBenefitInfo skuInfo={skuInfo} proceedsList={childOrderProceeds} />
                          </Col>
                        </Row>
                      )
                    }
                    <Row>
                      <Col style={{ fontWeight: 'bold' }}>订单客服备注：</Col>
                      {Array.isArray(childOrder.orderLogs) && childOrder.orderLogs.map(v => (
                        <Col key={v.createTime}>{v.info} （{formatDate(v.createTime)} {v.operator}）</Col>
                      ))}
                      {Array.isArray(childOrder.orderChildServerVOS) && childOrder.orderChildServerVOS.map(v => (
                        <Col key={v.orderCode}>
                          {Array.isArray(v.commentListVO) && v.commentListVO.map(item => (
                            <div key={item.createTime}>
                              <span>{(Array.isArray(item.info) && item.info.length > 0) ? item.info[item.info.length -1].value: ''}</span>
                              <span>（{formatDate(item.createTime)} {item.name}）</span>
                              <span>
                              售后单号：(
                                <span
                                  className='href'
                                  onClick={() => APP.history.push(`/order/refundOrder/${v.id}`)}
                                >
                                  {v.orderCode}
                                </span>
                              )
                              </span>
                            </div>
                          ))}
                        </Col>
                      ))}
                    </Row>
                    {orderInfo.orderType===55
                      ? (
                        <Row>
                          <Col style={{ fontWeight: 'bold' }}>充值信息</Col>
                          <Col>
                            <span>充值方式：{(orderVirtualInfoVO.rechargeWayDesc)||'暂无'}</span>
                            <span style={{ marginLeft: 20, marginRight: 20 }}>充值状态：{(orderVirtualInfoVO.rechargeStatusDesc)||'暂无'}</span>
                            <span>充值单号：{(orderVirtualInfoVO.rechargeNo)||'暂无'}</span>
                          </Col>
                        </Row>
                      ) : null}

                    <LogisticsInfo
                      mainorderInfo={orderInfo}
                      logistics={logistics}
                      onSuccess={this.props.query}
                      orderInfo={childOrder}
                    />
                  </>
                )
              }}
            />
          </div>
        </div>
      </>
    )
  }
}

export default alert(GoodsTable)
