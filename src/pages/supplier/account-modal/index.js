import React, { Component } from 'react';
import { Modal } from 'antd';
class AccoutModal extends Component {
  handleOk() {}
  handleCancel() {}
  render() {
    return (
      <Modal
        title="Basic Modal"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    );
  }
}
export default AccoutModal;