import React, { Component } from 'react';
import { queryOrderDetail, push1688, withhold } from '../api';
import { get, map } from 'lodash';
import { Button, Row, Card, Col, message, Modal } from 'antd';
import BuyerInfo from './buyer-info';
import OrderInfo from './order-info';
import GoodsTable from './goods-table';
import BenefitInfo from './benefit-info';
import StepInfo from './step-info';
import { enumOrderStatus, OrderStatusTextMap } from '../constant';
import DeliveryModal from './components/delivery-modal';
import { formatMoneyWithSign } from '../../helper';
const styleObj = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  padding: '0 24px'
}
const { confirm } = Modal;
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      childOrderList: [],
      data: {},
      remark: ''
    };
    this.query();
  }
  get id() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    return id;
  }
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
  }
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
  comfirmWithhold = (id) => {
    confirm({
      title: '确认重新发起代扣?',
      onOk() {
        this.withhold(id)
      }
    });
  }
  comfirmPush1688 = (id) => {
    confirm({
      title: '确认重新推送1688?',
      onOk() {
        this.push1688(id)
      }
    });
  }
  render() {
    const { data, childOrderList } = this.state;
    console.log('childOrderList=>', childOrderList)
    const orderStatus = get(data, 'orderInfo.orderStatus', enumOrderStatus.Unpaid);
    const orderStatusLogList = get(data, 'orderStatusLogList', []);

    return (
      <>
        <StepInfo orderStatus={orderStatus} orderStatusLogList={orderStatusLogList} />
        <OrderInfo
          orderInfo={data.orderInfo}
          buyerInfo={data.buyerInfo}
          refresh={this.query}
        />
        <BuyerInfo buyerInfo={data.buyerInfo} orderInfo={data.orderInfo} />
        <Card title="详细信息">
          {map(childOrderList, (item, index) => {
            return (
              <div key={index}>
                <Row gutter={24}>
                  <Col span={8}>子订单号{index + 1}: {item.childOrder.orderCode}</Col>
                  <Col span={8}>订单状态：{OrderStatusTextMap[item.childOrder.orderStatus]}</Col>
                  <Col className="gutter-row" span={8}>
                    {(orderStatus >= enumOrderStatus.Undelivered && orderStatus <= enumOrderStatus.Complete) ? (
                      <DeliveryModal mainorderInfo={data.orderInfo} title="发货" onSuccess={this.query} orderId={item.childOrder.id} logistics={item.logistics} />
                    ) : ''}
                    {item.canProtocolPay ? <Button
                      type="link"
                      style={{ margin: '0 10px 10px 0' }}
                      onClick={() => this.comfirmWithhold(item.childOrder.id)}
                    >重新发起代扣</Button> : ''}
                    {item.canPush ? <Button
                      style={{ margin: '0 10px 10px 0' }}
                      type="link"
                      onClick={() => this.comfirmPush1688(item.childOrder.id)}
                    >重新推送1688 </Button> : ''}
                  </Col>
                </Row>
                <GoodsTable
                  list={item.skuList}
                  childOrder={item.childOrder}
                  orderInfo={data.orderInfo}
                  logistics={item.logistics}
                  query={this.query}
                  memberId={data.buyerInfo && data.buyerInfo.memberAddress && data.buyerInfo.memberAddress.memberId}
                  showModal={this.showModal}
                  rowKey={record => record.id}
                />
              </div>
            );
          })}
          <div style={styleObj}>
            {/* <Col span={4}>含税费：{formatMoneyWithSign(data.taxPrice)}</Col> */}
            <div>运费：{formatMoneyWithSign(data.freight)}</div>
            <div>实际支付：<span style={{ color: 'red' }}>{formatMoneyWithSign(data.totalPrice)}</span></div>
          </div>
          <BenefitInfo data={data.orderYield} orderInfo={data.orderInfo} refresh={this.query} />
        </Card>
      </>
    );
  }
}

export default Detail;
