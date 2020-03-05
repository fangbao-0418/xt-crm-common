import React, { Component } from 'react';
import { Modal, Input } from 'antd';
import { connect } from '@/util/utils';
import Form, { FormItem } from '@/packages/common/components/form';

const { TextArea } = Input;

@connect(state => ({
  modal: state['shop.boss'].batchModal
}))
@Form.create()
export default class extends Component {

  /** 确定操作 */
  handleOk = () => {
    const { form: { validateFields }, dispatch } = this.props
    validateFields((err, values) => {
      if (err) return;
      dispatch['shop.boss'].checkUser(values);
    });
  }

  /** 取消操作 */
  handleCancel = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'shop.boss/saveDefault',
      payload: {
        batchModal: {
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
    const { modal, form: { getFieldDecorator } } = this.props

    return (
      <Modal
        visible={modal.visible}
        title="添加手机号, 开通小店"
        okText="查询用户"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        afterClose={this.handleClose}
      >
        <Form layout="vertical">
          <FormItem label="请输入手机号">
            {getFieldDecorator('phone', {
              rules: [{
                required: true,
                message: '请输入至少一个手机号码！'
              }]
            })(
              <TextArea
                placeholder="仅允许添加手机, 多个手机号请用按 enter 键, 换行隔开,;最多添加1000个手机号"
                autoSize={{ minRows: 8, maxRows: 20 }}
              />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}