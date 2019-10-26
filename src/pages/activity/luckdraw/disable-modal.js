// 失效弹窗

import React, { Component } from 'react';
import { Modal, Button, Input, message } from 'antd';


class DisableModal extends Component {
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
        console.log('handleOk', this.state.remark);
    }
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
            <div>
                <Button type="primary" onClick={this.showModal}>
                    失效
                </Button>
                <Modal
                title="确认抽奖码失效"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                <Input maxLength={20}
                    value={this.state.remark}
                    placeholder="请输入失效原因"
                    onChange={this.handleInputChange}
                />
                </Modal>
            </div>
        )
    }
}

export default DisableModal;