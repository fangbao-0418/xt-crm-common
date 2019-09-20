import React, { Component } from 'react';
import { Table, Row, Col, Card, Button, Modal, Input, message } from 'antd';
import AfterSaleForm from './after-sale-form';
import { withRouter } from 'react-router'
import { getDetailColumns, storeType } from '../constant';
import LogisticsInfo from './logistics-info';
import { Decimal } from 'decimal.js';
import { formatDate } from '../../helper';
import { customerAdd } from '../api';
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
    console.log('orderStatus=>', orderStatus)
    return [20, 30, 40, 50].includes(orderStatus)
  }
  handleApply = (record) => {
    const {orderInfo = {}, childOrder={}, memberId } = this.props;
    if (record.canApply) {
      this.setState({ modalInfo: { ...record, mainOrderId: orderInfo.id, memberId, childOrder } });
      this.setState({
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
  handleOk = async () => {
    const { form } = this.afterSaleForm.props;
    const { modalInfo } = this.state;
    const fields = form.getFieldsValue();
    fields.imgUrl = Array.isArray(fields.imgUrl) ? fields.imgUrl.map(v => v.url) : [];
    console.log('fields.imgUrl=>', fields.imgUrl)
    fields.imgUrl = fields.imgUrl.map(urlStr => urlStr.replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', ''))
    console.log('fields.imgUrl=>', fields.imgUrl)
    if (fields.amount) {
      fields.amount = new Decimal(fields.amount).mul(100).toNumber();
    }
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
      this.setState({
        visible: false
      })
    }
  }
  lookForHistory = ({orderCode, productId}) => {
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
            <Button type="link" size="small" onClick={() => this.setState({ notesVisible: true, modalInfo: {...record} })}>添加备注</Button>
            {record.canShowHistoryBtn && <Button type="link" size="small" onClick={() => this.lookForHistory({ ...record, orderCode: orderInfo.orderCode })}>历史售后</Button>}
          </>
        )
      }
    ];
    return (
      <>
        <Modal width='60%' style={{ top: 20 }} title="代客申请售后" visible={this.state.visible} onCancel={() => this.setState({ visible: false })} onOk={this.handleOk}>
          <AfterSaleForm wrappedComponentRef={ref => this.afterSaleForm = ref} info={this.state.modalInfo} modalInfo={this.state.modalInfo} />
        </Modal>
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
