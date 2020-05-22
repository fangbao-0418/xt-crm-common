import React, { Component } from 'react'
import { Table, Row, Col, Card, Button, Modal, Input, message, Divider } from 'antd'
import { formatMoney } from '@/packages/common/utils'
import ApplyAfterSaleModal from '../components/modal/ApplyAfterSale'
import { withRouter } from 'react-router'
import { getDetailColumns } from '../constant'
import LogisticsInfo from './logistics-info'
import ChildOrderBenefitInfo from './child-order-benefit-info'
import { setOrderRemark, setRefundOrderRemark, getProceedsListByOrderIdAndSkuId, applyOrderRefundDetails } from '../api'
import alert from '@/packages/common/components/alert'
import * as adapter from './adapter'
@withRouter
class GoodsTable extends Component {
  state = {
    visible: false,
    notesVisible: false,
    modalInfo: {},
    proceedsVisible: false,
    childOrderProceeds: [],
    skuInfo: {}
  }
  /**
   * 是否显示申请售后按钮
   * orderStatus 订单状态（10：待付款；20：待发货；30：已发货；50完成）
   */
  showApplyBtn = (orderStatus) => {
    return orderStatus === 50
  }

  handleApply = (record) => {
    const { orderInfo = {}, childOrder = {}, memberId } = this.props
    const res = applyOrderRefundDetails({
      childOrderCode: childOrder.orderCode
    }).then(res => {
      this.setState({
        modalInfo: res,
        visible: true
      })
    }, err => {
      Modal.confirm({
        title: '系统提示',
        content: err.message,
        okText: '查看详情',
        cancelText: '取消',
        onOk: () => {
          if (!err.data) {
            APP.error('未获取数据信息, 请联系管理人员')
            return
          }
          APP.history.push(`/fresh/saleAfter/detail/${err.data.refundOrderCode}`)
        }
      })
    })
  }
  handleInputChange = e => {
    this.setState({
      remark: e.target.value
    })
  }
  lookForHistory = (record) => {
    const { history } = this.props
    history.push('/fresh/saleAfter')
    APP.fn.setPayload('freshSaleAfter', {
      childOrderCode: record.childOrder
    })
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
    const columns = [
      ...(getDetailColumns().filter(item => item.key !== 'storeName')),
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width: 130,
        render: (text, record, index) => (
          <>
            <div>
              {this.showApplyBtn(orderInfo.orderStatus) && (
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
                  onClick={() => this.lookForHistory({ ...record })}>
                  历史售后
                </Button>
              )}
            </div>
          </>
        )
      }
    ]
    return (
      <>
        {this.state.modalInfo.mainOrderId
          && <ApplyAfterSaleModal
            onCancel={() => this.setState({ visible: false })}
            successCb={() => this.setState({ visible: false }, this.props.query)}
            visible={this.state.visible}
            modalInfo={this.state.modalInfo} />}
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
                        <Col key={v.createTime}>{v.info} （{APP.fn.formatDate(v.createTime)} {v.operator}）</Col>
                      ))}
                      {Array.isArray(childOrder.orderChildServerVOS) && childOrder.orderChildServerVOS.map(v => (
                        <Col key={v.orderCode}>
                          {Array.isArray(v.commentListVO) && v.commentListVO.map(item => (
                            <div key={item.createTime}>
                              <span>{(Array.isArray(item.info) && item.info.length > 0) ? item.info[item.info.length -1].value: ''}</span>
                              <span>（{APP.fn.formatDate(item.createTime)} {item.name}）</span>
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
