import React, { Component } from 'react'
import { Modal, Input } from 'antd'
import { connect } from '@/util/utils'
import Form, { FormItem } from '@/packages/common/components/form'

const { TextArea } = Input

@connect(state => ({
  modal: state['shop.boss.detail'].passModal,
  detail: state['shop.boss.detail'].detail
}))
@Form.create()
export default class extends Component {

  /** 确定操作 */
  handleOk = () => {
    const { form: { validateFields }, dispatch, modal, history } = this.props
    validateFields((err, values) => {
      if (err) {
        return
      }
      dispatch['shop.boss.detail'].noPassShop({
        ...values,
        merchantApplyId: modal.merchantApplyId
      }, () => {
        history.push('/shop/boss')
      })
    })
  }

  /** 取消操作 */
  handleCancel = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'shop.boss.detail/saveDefault',
      payload: {
        passModal: {
          visible: false
        }
      }
    })
  }

  /** 窗口彻底关闭回调 */
  handleClose = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'shop.boss.detail/saveDefault',
      payload: {
        currentBoss: null
      }
    })
  }

  render () {
    const { modal, detail, form: { getFieldDecorator } } = this.props

    if (!detail) {
      return null
    }

    const modalTitle = `操作 ${detail.shopName || '暂无昵称'} 店铺`

    const fontStyle = {
      color: 'red'
    }

    return (
      <Modal
        visible={modal.visible}
        title={modalTitle}
        okText='审核不通过'
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        afterClose={this.handleClose}
        destroyOnClose
      >
        <Form layout='vertical'>
          <FormItem label={<span style={fontStyle}>请填写审核不通过原因</span>}>
            {getFieldDecorator('reason', {
              rules: [{
                required: true,
                message: '请输入不通过理由！'
              }]
            })(
              <TextArea
                placeholder='200字以内'
                maxLength={200}
                autoSize={{ minRows: 8, maxRows: 20 }}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}