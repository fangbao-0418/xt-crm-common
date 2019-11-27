import React, { Component } from 'react';
import { queryOrderDetail, push1688, withhold, getProceedsListByOrderId, cancelIntercept } from '../api';
import { get, map } from 'lodash';
import { Button, Row, Card, Col, message, Modal, Divider } from 'antd';
import BuyerInfo from './buyer-info';
import OrderInfo from './order-info';
import GoodsTable from './goods-table';
import BenefitInfo from './benefit-info';
import StepInfo from './step-info';
import { enumOrderStatus, OrderStatusTextMap, storeType } from '../constant';
import DeliveryModal from './components/delivery-modal';
import { dateFormat } from '@/util/utils';
import moment from 'moment';
import WithModal from './components/modal'

const { confirm } = Modal;
class Detail extends Component {
  get id() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    return id;
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      childOrderList: [],
      data: {},
      remark: '',
      userProceedsListByOrderId: [],
      goodsTableKey: 0,
      deliveryVisible: false,
      deliveryData: {}
    };
  }

  componentDidMount() {
    this.query();
  }

  /**
   * 查询订单详情信息
   */
  query = () => {
    queryOrderDetail({ orderCode: this.id }).then((data = {}) => {
      const childOrderMap = {};
      (data.orderInfo && data.orderInfo.childOrderList || []).forEach(item => {
        childOrderMap[item.id] = {
          childOrder: item,
          logistics: item,
          skuList: item.skuList,
        };
      });
      (data.logisticsList || []).forEach(item => {
        const id = Number(item.childOrderId);
        childOrderMap[id] && (childOrderMap[id].logistics = item);
      });
      (data.skuList || []).forEach(item => {
        const id = Number(item.childOrderId);
        childOrderMap[id] && childOrderMap[id].skuList && childOrderMap[id].skuList.push(item);
      });
      this.setState({
        data: data,
        childOrderList: Object.values(childOrderMap),
      });
    });
    this.queryProceeds();
  }

  /**
   * 查询订单整单收益信息
   */
  queryProceeds = () => {
    getProceedsListByOrderId({ orderCode: this.id }).then((result) => {
      const { goodsTableKey } = this.state;
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
  push1688(id) {
    if (this.pushload) return;
    this.pushload = true;
    push1688(id).then(res => {
      if (res.success) {
        message.success('操作成功');
      } else {
        message.error(res.message)
      }
    }).finally(() => {
      this.pushload = false;
    })
  }

  /**
   * 发起代扣
   * @param {string} id 订单Id 
   */
  withhold(id) {
    if (this.holdload) return;
    this.holdload = true;
    withhold(id).then(res => {
      if (res && res.success) {
        message.success('操作成功');
      } else {
        message.error(res.message)
      }
    }).finally(() => {
      this.holdload = false;
    })
  }

  /**
   * 确认发起代扣弹窗
   * @param {string} id 订单Id 
   */
  comfirmWithhold = (id) => {
    confirm({
      title: '确认重新发起代扣?',
      onOk() {
        this.withhold(id)
      }
    });
  }

  /**
   * 确认推送1688弹窗
   * @param {string} id 订单Id 
   */
  comfirmPush1688 = (id) => {
    confirm({
      title: '确认重新推送1688?',
      onOk() {
        this.push1688(id)
      }
    });
  }
  render() {
    let { data, childOrderList, userProceedsListByOrderId, goodsTableKey, deliveryVisible, deliveryData } = this.state;
    const orderStatus = get(data, 'orderInfo.orderStatus', enumOrderStatus.Unpaid);
    const orderStatusLogList = get(data, 'orderStatusLogList', []);
    console.log(childOrderList, 'childOrderList')
    return (
      <>
        <StepInfo orderStatus={orderStatus} orderStatusLogList={orderStatusLogList} />
        {/* 订单信息 */}
        <OrderInfo orderInfo={data.orderInfo} buyerInfo={data.buyerInfo} />
        {/* 支付信息 */}
        <BuyerInfo buyerInfo={data.buyerInfo} orderInfo={data.orderInfo} freight={data.freight} totalPrice={data.totalPrice} />
        {/* 海关信息 */}
        <Card title='海关信息'>
          <Row gutter={24}>
            <Col span={8}>海淘状态：{}</Col>
            <Col span={8}>清关完成时间：{}</Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>订单报文：申报中
              <Button type='link'
                onClick={() => {
                  this.props.modal.show({
                    type: 'payMessage',
                    title: '支付单报文详情'
                  })
                }}>
                查看详情
              </Button>
            </Col>
            <Col span={8}>支付单报文：申报中 
              <Button
                type='link'
                onClick={() => {
                  this.props.modal.show({
                    type: 'orderMessage',
                    title: '订单报文详情'
                  })
                }}>
                查看详情
              </Button>
            </Col>
          </Row>
        </Card>
        <Card title="详细信息">
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
                          <span> {item.childOrder.interceptorType == 10 ? '(拦截订单)' : ''}</span>
                        </Col>
                        <Col span={8}>
                          <span>订单状态：</span>
                          <span>
                            {OrderStatusTextMap[item.childOrder.orderStatus]}
                          </span>
                          <span>
                            {
                              (item.childOrder.orderStatus == enumOrderStatus.Intercept && item.childOrder.interceptorTimeOut) ?
                                `(${moment(item.childOrder.interceptorTimeOut).format(dateFormat)})` :
                                ''
                            }
                          </span>
                        </Col>
                        <Col className="gutter-row" span={8} style={{ textAlign: 'right' }}>
                          { /** 海淘子订单的发货按钮去掉 */
                            (orderStatus >= enumOrderStatus.Undelivered && orderStatus <= enumOrderStatus.Complete) && (
                              <Button type='primary' onClick={() => this.changeModal(true, item)}>发货</Button>
                            )
                          }
                          {
                            (item.childOrder.interceptorType == 10 && (
                              item.childOrder.orderStatus == enumOrderStatus.Undelivered ||
                              item.childOrder.orderStatus == enumOrderStatus.Delivered)
                            ) ?
                              <Button type='primary' style={{ marginLeft: 8 }} onClick={() => this.cancelInterceptor(item)}>取消拦截发货</Button> :
                              null
                          }
                          {item.canProtocolPay ? <Button
                            type='primary'
                            style={{ margin: '0 10px 10px 0' }}
                            onClick={() => this.comfirmWithhold(item.childOrder.id)}
                          >重新发起代扣</Button> : ''}
                          {item.canPush ? <Button
                            style={{ margin: '0 10px 10px 0' }}
                            type='primary'
                            onClick={() => this.comfirmPush1688(item.childOrder.id)}
                          >重新推送1688 </Button> : ''}
                        </Col>
                        <Col span={8}>订单类型：{}</Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={8}>供应商：{item.childOrder.storeName}</Col>
                        <Col span={8}>分类：{storeType[item.childOrder.category]}</Col>
                        <Col span={8}>供应商订单号：{item.childOrder.storeOrderId || '无'}</Col>
                      </Row>
                      <Row>
                        {
                          item.childOrder.interceptorType == 10 &&
                            (
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
            );
          })}
        </Card>
        <Card title="整单收益信息">
          <BenefitInfo key={`benefit-${goodsTableKey}`} data={data.orderYield} orderInfo={data.orderInfo} proceedsList={userProceedsListByOrderId} refresh={this.queryProceeds} />
        </Card>
        <DeliveryModal
          type='add'
          title="发货"
          visible={deliveryVisible}
          mainorderInfo={data.orderInfo}
          onSuccess={this.onOk}
          orderId={(deliveryData.childOrder || {}).id}
          logistics={deliveryData.logistics}
          onCancel={() => this.changeModal(false)}
        />
      </>
    );
  }

  cancelInterceptor = ({
    childOrder
  }) => {
    console.log(childOrder);
    cancelIntercept({ interceptOrderId: childOrder.interceptorOrderRecordId, memberId: childOrder.interceptorMemberId }).then((res) => {
      if (res) {
        message.success('取消成功');
        this.query();
      }
    })
  }

  onOk = () => {
    this.setState({
      deliveryVisible: false
    }, () => {
      this.query();
    })
  }

  changeModal = (visible, data) => {
    this.setState({
      deliveryVisible: visible,
      deliveryData: data || {}
    })
  }
}

export default WithModal(Detail);
