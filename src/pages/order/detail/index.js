import React, { Component } from 'react';
import { queryOrderDetail, push1688, withhold } from '../api';
import { get, map } from 'lodash';
import { Row, Card, Col, message, Modal } from 'antd';
import BuyerInfo from './buyer-info';
import OrderInfo from './order-info';
import GoodsTable from './goods-table';
import BenefitInfo from './benefit-info';
import StepInfo from './step-info';
import { enumOrderStatus, OrderStatusTextMap } from '../constant';
// import { formatDate } from '../../helper';
import DeliveryModal from './components/delivery-modal';
import AfterSaleForm from './after-sale-form';
import { formatMoneyWithSign } from '../../helper';

// const payTypeList = {
//   100: '微信APP',
//   101: '微信小程序',
//   102: '微信公众号',
//   200: '支付宝APP',
//   201: '支付宝H5',
// };

const styleObj = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  padding: '0 24px'
}

class Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      childOrderList: [],
      data: {},
      modalInfo: {}
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
  toggleModal = (visible) => {
    this.setState({
      visible
    })
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
  showModal = (record) => {
    const modalInfo = Object.assign({}, record);
    this.setState({modalInfo});
    this.toggleModal(true);
  }
  render() {
    const { data, childOrderList } = this.state;
    const orderStatus = get(data, 'orderInfo.orderStatus', enumOrderStatus.Unpaid);
    const orderStatusLogList = get(data, 'orderStatusLogList', []);

    return (
      <>
        <Modal width='50%' style={{ top: 20 }} title="代客申请售后" visible={this.state.visible} onCancel={() => this.toggleModal(false)}>
          <AfterSaleForm info={this.state.modalInfo} modalInfo={this.state.modalInfo}/>
        </Modal>
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
                  <Col span={6}>子订单号{index + 1}: {item.childOrder.orderCode}</Col>
                  <Col span={6}>订单状态：{OrderStatusTextMap[item.childOrder.orderStatus]}</Col>
                  <Col className="gutter-row" span={6}>
                    {(orderStatus >= enumOrderStatus.Undelivered && orderStatus <= enumOrderStatus.Complete) ? (
                      <DeliveryModal mainorderInfo={data.orderInfo} title="发货" onSuccess={this.query} orderId={item.childOrder.id} logistics={item.logistics} />
                    ) : ''}
                  </Col>
                </Row>
                <GoodsTable
                  list={item.skuList}
                  childOrder={item.childOrder}
                  orderInfo={data.orderInfo}
                  logistics={item.logistics}
                  query={this.query}
                  orderLogs={item.orderLogs}
                  showModal={this.showModal}
                />
              </div>
            );
          })}
          <div style={styleObj}>
            {/* <Col span={4}>含税费：{formatMoneyWithSign(data.taxPrice)}</Col> */}
            <div>运费：{formatMoneyWithSign(data.freight)}</div>
            <div>实际支付：<span style={{ color: 'red' }}>{formatMoneyWithSign(data.totalPrice)}</span></div>
          </div>
          <BenefitInfo data={data.orderYield} />
        </Card>
      </>
    );
  }
}

export default Detail;
