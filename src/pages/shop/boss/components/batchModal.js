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
    validateFields((err, { phones }) => {
      if (err) return;
      phones = phones.replace(/\n/g, ',')
      dispatch['shop.boss'].checkUser({ phones });
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
        destroyOnClose
      >
        <Form layout="vertical">
          <FormItem label="请输入手机号">
            {getFieldDecorator('phones', {
              rules: [{
                validator: (rule, value, cb) => {
                  const reg = /^[1]([0-9])[0-9]{9}(\n[1]([0-9])[0-9]{9})*$/
                  if (!reg.test(value)) {
                    cb('请添加手机号,并按enter键隔开~')
                    // return
                  } else {
                    cb()
                  }
                }
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