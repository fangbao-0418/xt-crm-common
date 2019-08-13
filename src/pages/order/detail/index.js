import React, { Component } from 'react';
import { queryOrderDetail, push1688, withhold } from '../api';
import { get, map } from 'lodash';
import { Row, Card, Col, message, Modal, Input } from 'antd';
import BuyerInfo from './buyer-info';
import OrderInfo from './order-info';
import GoodsTable from './goods-table';
import BenefitInfo from './benefit-info';
import StepInfo from './step-info';
import { enumOrderStatus, OrderStatusTextMap } from '../constant';
import DeliveryModal from './components/delivery-modal';
import AfterSaleForm from './after-sale-form';
import { formatMoneyWithSign } from '../../helper';
import { customerAdd, setOrderRemark, setRefundOrderRemark } from '../api';
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
      modalInfo: {},
      remark: '',
      notesVisible: false
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
  handleInputChange = e => {
    this.setState({
      remark: e.target.value,
    });
  };
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
    this.setState({ modalInfo });
    this.toggleModal(true);
  }
  showNotes = (record) => {
    const modalInfo = Object.assign({}, record);
    console.log('modalInfo=>', modalInfo)
    this.setState({ modalInfo });
    this.toggleNotesVisible(true)
  }
  handleOk = async () => {
    const { form } = this.afterSaleForm.props;
    const { modalInfo } = this.state;
    const fields = form.getFieldsValue();
    fields.imgUrl = fields.imgUrl.map(v => v.url);
    fields.amount = fields.amount * 100;
    console.log('modalInfo=>', modalInfo)
    const res = await customerAdd({
      childOrderId: modalInfo.childOrderId,
      mainOrderId: modalInfo.mainOrderId,
      memberId: modalInfo.memberId,
      skuId: modalInfo.skuId,
      ...fields
    });
    if (res.success) {
      message.success('申请售后成功');
    }
    this.setState({visible: true})
  }
  handleAddNotes = () => {
    const { modalInfo } = this.state;
    const params = {
      orderCode: this.props.match.params.id,
      refundId: modalInfo.refundId,
      childOrderId: modalInfo.childOrderId,
      info: this.state.remark,
    };
    const apiFunc = modalInfo.refundId ? setRefundOrderRemark : setOrderRemark;
    apiFunc(params).then((res) => {
      res && message.success('添加备注成功');
      this.query();
      this.setState({
        notesVisible: false,
      });
    });
  }
  toggleNotesVisible = (notesVisible) => {
    this.setState({ notesVisible });
  }
  render() {
    const { data, childOrderList } = this.state;
    console.log('childOrderList=>', childOrderList)
    const orderStatus = get(data, 'orderInfo.orderStatus', enumOrderStatus.Unpaid);
    const orderStatusLogList = get(data, 'orderStatusLogList', []);

    return (
      <>
        <Modal width='50%' style={{ top: 20 }} title="代客申请售后" visible={this.state.visible} onCancel={() => this.toggleModal(false)} onOk={this.handleOk}>
          <AfterSaleForm wrappedComponentRef={ref => this.afterSaleForm = ref} info={this.state.modalInfo} modalInfo={this.state.modalInfo} />
        </Modal>
        <Modal
          title="添加备注"
          visible={this.state.notesVisible}
          onOk={this.handleAddNotes}
          onCancel={() => this.toggleNotesVisible(false)}
        >
          <Input
            value={this.state.remark}
            placeholder="请输入备注"
            onChange={this.handleInputChange}
          />
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
                  <Col span={8}>子订单号{index + 1}: {item.childOrder.orderCode}</Col>
                  <Col span={8}>订单状态：{OrderStatusTextMap[item.childOrder.orderStatus]}</Col>
                  <Col className="gutter-row" span={8}>
                    {(orderStatus >= enumOrderStatus.Undelivered && orderStatus <= enumOrderStatus.Complete) ? (
                      <DeliveryModal mainorderInfo={data.orderInfo} title="发货" onSuccess={this.query} orderId={item.childOrder.id} logistics={item.logistics} />
                    ) : ''}
                  </Col>
                </Row>
                <GoodsTable
                  showNotes={this.showNotes}
                  list={item.skuList}
                  childOrder={item.childOrder}
                  orderInfo={data.orderInfo}
                  logistics={item.logistics}
                  query={this.query}
                  memberId={data.buyerInfo && data.buyerInfo.memberAddress && data.buyerInfo.memberAddress.memberId}
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
