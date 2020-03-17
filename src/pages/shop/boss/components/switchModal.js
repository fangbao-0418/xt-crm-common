import React, { Component } from 'react';
import { Modal, Input } from 'antd';
import { connect } from '@/util/utils';
import Form, { FormItem } from '@/packages/common/components/form';
import { switchModalConfig } from '../config';

const { TextArea } = Input;

@connect(state => ({
  modal: state['shop.boss'].switchModal,
  currentBoss: state['shop.boss'].currentBoss
}))
@Form.create()
export default class extends Component {

  /** 确定操作 */
  handleOk = () => {
    const { form: { validateFields }, dispatch, currentBoss } = this.props
    validateFields((err, values) => {
      if (err) return;
      dispatch['shop.boss'].closeShop({
        ...values,
        shopId: currentBoss.id,
        shopStatus: 3
      });
    });
  }

  /** 取消操作 */
  handleCancel = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'shop.boss/saveDefault',
      payload: {
        switchModal: {
          visible: false
        }
      }
    });
  }

  /** 窗口彻底关闭回调 */
  handleClose = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'shop.boss/saveDefault',
      payload: {
        currentBoss: null
      }
    });
  }

  render() {
    const { modal, currentBoss, form: { getFieldDecorator } } = this.props

    if (!currentBoss) return null

    const modalTitle = `操作 ${currentBoss.nickName || '暂无昵称'} 店长`

    const fontStyle = {
      color: 'red'
    }

    return (
      <Modal
        visible={modal.visible}
        title={modalTitle}
        okText="确认关店"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        afterClose={this.handleClose}
        destroyOnClose
      >
        <div>
          <p style={fontStyle}>关店前请务必阅读关店注意事项！</p>
          {
            switchModalConfig.hint.map((item, i) => <p style={{ marginTop: 8 }} key={i}>{item}</p>)
          }
        </div>
        <Form layout="vertical">
          <FormItem label={<span style={fontStyle}>关店原因</span>}>
            {getFieldDecorator('closeReason', {
              rules: [{
                required: true,
                message: '请输入关店理由！'
              }]
            })(
              <TextArea
                placeholder="请输入关店理由"
                autoSize={{ minRows: 8, maxRows: 20 }}
              />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}