import React, { Component } from 'react';
import { Modal } from 'antd';
import { connect } from '@/util/utils';

@connect(state => ({
  modal: state['shop.boss'].checkModal,
  usersInfo: state['shop.boss'].usersInfo
}))
export default class extends Component {

  /** 确定操作 */
  handleOk = () => {
    console.log('这里开通')
  }

  /** 取消操作 */
  handleCancel = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'shop.boss/saveDefault',
      payload: {
        checkModal: {
          visible: false
        }
      }
    });
  }

  render() {
    const { modal, usersInfo } = this.props

    if (!usersInfo) return;

    return (
      <Modal
        visible={modal.visible}
        okText="确认开通"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div>
          <p style={{ fontWeight: 600, fontSize: 24, textAlign: "center", margin: '16px 0' }}>共识别到189个用户可开通小店</p>
          <p>另，20个黑名单用户不可添加,12个用户已开通,12个用户非喜团主播,13段文字格式不正确 <span className="href">导出</span></p>
          <p style={{ marginTop: 32 }}>提示：如有无法识别字符请检查手机号长度或者逗号格式是否英文状态</p>
        </div>
      </Modal>
    )
  }
}