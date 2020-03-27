/*
 * @Date: 2019-11-12 11:03:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-25 16:35:10
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/activity/luckdraw/disable-modal.js
 */
// 失效弹窗

import React, { Component } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { lotteryDisable, lotteryEnable } from '../api';

class DisableModal extends Component {
    constructor(props) {
        super(props);
    }
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
        this.handleBatchDisable()
    }
    // 批量失效
    handleBatchDisable = () => {
        if (!this.state.remark) {
            APP.error('请填写失效原因')
            return
        }
        let rows = this.props.selRow.map(item => {
            return item.ticketCode
        })
        lotteryDisable({ ticketCodes: rows,failureReason: this.state.remark }).then(res => {
            if (res) {
                APP.success("操作成功！")
                this.handleCancel()
            } else {
                APP.error("操作失败！")
            }
            this.props.handleSearch()
        })
    }

    handleCancel = e => {
        this.setState({
            visible: false,
            remark: ''
        });
    };
    handleInputChange = e => {
        this.setState({
          remark: e.target.value,
        });
      };
    render() {
        const { size } = this.props
        return (
            <div style={{display:"inline-block"}}>
                <Button size={size} disabled={this.props.disabled} type="danger" onClick={this.showModal}>
                    {this.props.btntext}
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