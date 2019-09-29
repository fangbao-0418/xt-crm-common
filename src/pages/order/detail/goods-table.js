import React, { Component } from 'react';
import { Table, Row, Col, Card, Button, Modal, Input, message } from 'antd';
import ApplyAfterSaleModal from '../components/modal/ApplyAfterSaleModal';
import { withRouter } from 'react-router'
import { getDetailColumns, storeType } from '../constant';
import LogisticsInfo from './logistics-info';
import { formatDate } from '../../helper';
import { setOrderRemark, setRefundOrderRemark } from '../api';

@withRouter
class GoodsTable extends Component {
  state = {
    visible: false,
    notesVisible: false,
    modalInfo: {}
  }
  // 是否显示申请售后按钮
  showApplyBtn = (orderStatus) => {
    return [20, 30, 40, 50].includes(orderStatus)
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
  render() {
    const { list = [], childOrder = {}, orderInfo = {}, logistics } = this.props;
    const columns = [
      ...getDetailColumns(),
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record, index) => (
          <>
            {this.showApplyBtn(orderInfo.orderStatus) && <Button type="link" size="small" onClick={() => this.handleApply(record)}>申请售后</Button>}
            <Button type="link" size="small" onClick={() => this.setState({ notesVisible: true, modalInfo: { ...record } })}>添加备注</Button>
            {record.canShowHistoryBtn && <Button type="link" size="small" onClick={() => this.lookForHistory({ ...record, orderCode: orderInfo.orderCode })}>历史售后</Button>}
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
        <Card>
          <Row gutter={24}>
            <Col span={8}>供应商：{childOrder.storeName}</Col>
            <Col span={8}>分类： {storeType[childOrder.category]}</Col>
            <Col span={8}>供应商订单号：{childOrder.storeOrderId}</Col>
          </Row>
          <Table rowKey={record => record.skuId} columns={columns} dataSource={list} pagination={false} />
          <Row>
            <Col span={2} style={{ minWidth: '7em' }}>客服备注：</Col>
            <Col span={22}>
              <Row>
                {Array.isArray(childOrder.orderLogs) && childOrder.orderLogs.map(v => <Col key={v.createTime}>{v.info} （{formatDate(v.createTime)} {v.operator}）</Col>)}
              </Row>
            </Col>
          </Row>
          <LogisticsInfo mainorderInfo={orderInfo} logistics={logistics} onSuccess={this.props.query} orderInfo={childOrder} />
        </Card>
      </>
    );
  }
}

export default GoodsTable;
