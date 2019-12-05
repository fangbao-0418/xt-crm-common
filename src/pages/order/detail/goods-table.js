import React, { Component } from 'react';
import { Table, Row, Col, Card, Button, Modal, Input, message, Divider } from 'antd';
import { formatMoney } from '@/packages/common/utils'
import ApplyAfterSaleModal from '../components/modal/ApplyAfterSale';
import { withRouter } from 'react-router'
import { getDetailColumns, storeType } from '../constant';
import LogisticsInfo from './logistics-info';
import { Decimal } from 'decimal.js';
import ChildOrderBenefitInfo from './child-order-benefit-info';
import { formatDate } from '../../helper';
import { customerAdd, customerAddCheck, setOrderRemark, setRefundOrderRemark, getProceedsListByOrderIdAndSkuId } from '../api';

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
  // 是否显示申请售后按钮
  showApplyBtn = (orderStatus, orderType) => {
    return orderType !== 50 && orderType !== 60 && [20, 25, 30, 40, 50].includes(orderStatus)
  }
  handleApply = (record) => {
    const { orderInfo = {}, childOrder = {}, memberId } = this.props;
    if (record.canApply) {
      this.setState({
        modalInfo: { ...record, mainOrderId: orderInfo.id, memberId, childOrder },
        visible: true
      })
    } else {
      Modal.confirm({
        title: '系统提示',
        content: record.errormsg,
        okText: '查看详情',
        cancelText: '取消',
        onOk: () => {
          this.props.history.push(`/order/refundOrder/${record.skuServerId}`);
        }
      });
    }
  }
  handleInputChange = e => {
    this.setState({
      remark: e.target.value,
    });
  };
  lookForHistory = ({ orderCode, productId }) => {
    const { history } = this.props;
    history.push(`/order/refundOrder?mainOrderCode=${orderCode}&productId=${productId}`);
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
      this.props.query();
      this.setState({
        notesVisible: false,
      });
    });
  }

  /**
   * 展示/收起子订单收益列表
   */
  childOrderProceeds = (skuInfo, currentVisible) => {
    const { orderInfo = {} } = this.props;
    const { skuId } = skuInfo;
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

  render() {
    const { tableTitle } = this.props;
    const { proceedsVisible, childOrderProceeds, skuInfo } = this.state;
    const orderInfo = this.props.orderInfo || {}
    const childOrder = this.props.childOrder || {}
    const list = this.props.list || []
    const logistics = this.props.logistics || {}
    console.log(list, 'list')
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
              {this.showApplyBtn(orderInfo.orderStatus, record.orderType) && <Button style={{ padding: 0 }} type="link" size="small" onClick={() => this.handleApply(record)}>申请售后</Button>}
            </div>
            <div>
              <Button style={{ padding: 0 }} type="link" size="small" onClick={() => this.setState({ notesVisible: true, modalInfo: { ...record } })}>添加备注</Button>
            </div>
            <div>
              {record.canShowHistoryBtn && <Button style={{ padding: 0 }} type="link" size="small" onClick={() => this.lookForHistory({ ...record, orderCode: orderInfo.orderCode })}>历史售后</Button>}
            </div>
            <div>
              <Button style={{ padding: 0 }} type="link" size="small" onClick={() => this.childOrderProceeds(record, proceedsVisible)}>{proceedsVisible ? "收起收益" : "查看收益"}</Button>
            </div>
          </>
        )
      }
    ];
    return (
      <>
        {this.state.modalInfo.mainOrderId &&
          this.state.modalInfo.skuId &&
          <ApplyAfterSaleModal
            onCancel={() => this.setState({ visible: false })}
            successCb={() => this.setState({ visible: false }, this.props.query)}
            visible={this.state.visible}
            modalInfo={this.state.modalInfo} />}
        <Modal
          title="添加备注"
          visible={this.state.notesVisible}
          onOk={this.handleAddNotes}
          onCancel={() => this.setState({ notesVisible: false })}
        >
          <Input
            value={this.state.remark}
            placeholder="请输入备注"
            onChange={this.handleInputChange}
          />
        </Modal>
        <div>
          <div>
            <Table
              bordered
              rowKey={record => record.skuId}
              columns={columns}
              dataSource={list}
              pagination={false}
              title={() => tableTitle}
              footer={() => {
                return <>
                  <Row style={{ marginBottom: 20 }}>
                      <Col style={{textAlign: 'right'}}>
                        <span style={{ fontWeight: 'bold' }}></span>
                        <span className="mr10">运费合计：<font color="red">{formatMoney(childOrder.originFreight)}</font></span>
                        <span className="mr10">运费优惠：<font color="red">{formatMoney(-(childOrder.couponFreight))}</font></span>
                        <span>运费实付：{formatMoney(childOrder.payFreight)}</span>
                      </Col>
                  </Row>
                  {
                    !proceedsVisible ?
                      <Row style={{ marginBottom: 20 }}>
                        <Col>
                          <span style={{ fontWeight: 'bold' }}>SKU收益：</span>
                          <ChildOrderBenefitInfo skuInfo={skuInfo} proceedsList={childOrderProceeds} />
                        </Col>
                      </Row> :
                      null
                  }
                  <Row>
                    <Col>
                      <span style={{ fontWeight: 'bold' }}>客服备注：</span>
                      {Array.isArray(childOrder.orderLogs) && childOrder.orderLogs.map(v => <Col key={v.createTime}>{v.info} （{formatDate(v.createTime)} {v.operator}）</Col>)}
                    </Col>
                  </Row>
                  <LogisticsInfo mainorderInfo={orderInfo} logistics={logistics} onSuccess={this.props.query} orderInfo={childOrder} />
                </>
              }}
            />
          </div>
        </div>
      </>
    );
  }
}

export default GoodsTable;
