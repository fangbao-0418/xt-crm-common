import React, { Component } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { setOrderRemark, setRefundOrderRemark } from '../../../api';

class RemarkModal extends Component {
  state = {
    visible: false,
    remark: '',
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    const { onSuccess, orderCode, refundId, childOrderId } = this.props;
    const params = {
      orderCode: orderCode,
      refundId,
      childOrderId,
      info: this.state.remark,
    };
    const apiFunc = refundId ? setRefundOrderRemark : setOrderRemark;
    apiFunc(params).then((res) => {
      res && message.success('添加备注成功');
      onSuccess && onSuccess();
      this.setState({
        visible: false,
      });
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleInputChange = e => {
    this.setState({
      remark: e.target.value,
    });
  };

  render() {
    return (
      <div style={this.props.wrapperStyle}>
        <Button type="primary" onClick={this.showModal}>
          添加备注
        </Button>
        <Modal
          title="添加备注"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Input
            value={this.state.remark}
            placeholder="请输入备注"
            onChange={this.handleInputChange}
          />
        </Modal>
      </div>
    );
  }
}

export default RemarkModal;
