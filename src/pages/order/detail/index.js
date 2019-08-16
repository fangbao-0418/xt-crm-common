import React, { Component } from 'react';
import { queryOrderDetail, push1688, withhold } from '../api';
import { get, map } from 'lodash';
import { Row, Card, Col, Button, message } from 'antd';
import BuyerInfo from './buyer-info';
import OrderInfo from './order-info.js';
import GoodsTable from './goods-table';
import BenefitInfo from './benefit-info';
import LogisticsInfo from './logistics-info';
import StepInfo from './step-info';
import { enumOrderStatus, OrderStatusTextMap } from '../constant';
import DeliveryModal from './components/delivery-modal';

import { formatMoneyWithSign } from '../../helper';

const payTypeList = {
  100: '微信APP',
  101: '微信小程序',
  102: '微信公众号',
  200: '支付宝APP',
  201: '支付宝H5',
};

const storeType = ['喜团', '1688','淘宝联盟'];

class Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      childOrderList: [],
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

  push1688(id){
    if(this.pushload) return;
    this.pushload = true;
    push1688(id).then(res => {
      if(res.success) {
        message.success('操作成功');
      }else{
        message.error(res.message)
      }
    }).finally(()=>{
      this.pushload = false;
    })
  }
  withhold(id) {
    if(this.holdload) return;
    this.holdload = true;
    withhold(id).then(res => {
      if(res && res.success) {
        message.success('操作成功');
      }else{
        message.error(res.message)
      }
    }).finally(()=>{
      this.holdload = false;
    })
  }
  render() {
    const { data, childOrderList } = this.state;
    const orderStatus = get(data, 'orderInfo.orderStatus', enumOrderStatus.Unpaid);
    const orderStatusLogList = get(data, 'orderStatusLogList', []);

    return (
      <Card title="订单详情">
        <StepInfo orderStatus={orderStatus} orderStatusLogList={orderStatusLogList} />
        <OrderInfo
          orderInfo={data.orderInfo}
          refresh={this.query}
          payType={data.buyerInfo && data.buyerInfo.payType}
        />

        <BuyerInfo buyerInfo={data.buyerInfo} />

        {map(childOrderList, (item, index) => {
          return (
            <div style={{ margin: '30px 0' }} key={index}>
              <Card>
                <Row gutter={24}>
                  <Col className="gutter-row" span={9}>
                    <div className="gutter-box">
                      子订单号{index + 1}: {item.childOrder.orderCode}
                    </div>
                  </Col>
                  <Col className="gutter-row" span={9}>
                    <div className="gutter-box">
                      {payTypeList[data.buyerInfo && data.buyerInfo.payType]}支付流水号：
                      {item.childOrder.paymentNumber}
                    </div>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    {/* {item.canProtocolPay ? <Button
                      type="link"
                      style={{margin:'0 10px 10px 0'}}
                      onClick={() => this.withhold(item.childOrder.id)}
                    >发起代扣</Button> : ''}
                    {item.canPush ? <Button
                      style={{margin:'0 10px 10px 0'}}
                      type="link"
                      onClick={() => this.push1688(item.childOrder.id)}
                    > 推送1688 </Button> : ''} */}
                    {(orderStatus >= enumOrderStatus.Undelivered && orderStatus <= enumOrderStatus.Complete) ? (
                      <DeliveryModal mainorderInfo={data.orderInfo} title="发货" onSuccess={this.query} orderId={item.childOrder.id} logistics={item.logistics}/>
                    ) : ''}
                  </Col>
                  <Col className="gutter-row" span={9}>
                    <div className="gutter-box">
                      供应商订单号: {item.childOrder.storeOrderId}
                    </div>
                  </Col>
                  <Col className="gutter-row" span={9}>
                    <div className="gutter-box">供应商：{item.childOrder.storeName}， 分类： {storeType[item.childOrder.category]}</div>
                  </Col>
                  <Col className="gutter-row" span={9}>
                    <div className="gutter-box">订单状态：{OrderStatusTextMap[item.childOrder.orderStatus]}</div>
                  </Col>
                </Row>
                <LogisticsInfo mainorderInfo={data.orderInfo} logistics={item.logistics} onSuccess={this.query} orderInfo={item.childOrder} />
              <GoodsTable list={item.skuList} />
              </Card>
              
            </div>
          );
        })}

        <Row style={{ margin: '30px' }}>
          <Col span={4}>实际收款：{formatMoneyWithSign(data.totalPrice)}</Col>
          <Col span={4}>含税费：{formatMoneyWithSign(data.taxPrice)}</Col>
          <Col span={4}>含运费：{formatMoneyWithSign(data.freight)}</Col>
        </Row>
        <BenefitInfo data={data.orderYield} orderInfo={data.orderInfo} refresh={this.query}/>
      </Card>
    );
  }
}

export default Detail;
