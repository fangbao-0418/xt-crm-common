import React, { Component } from 'react';
import { Modal, Input, message } from 'antd';
import Form, { FormItem } from '@/packages/common/components/form';
import { unPassGoods } from '../api';

const { TextArea } = Input;

class UnpassModal extends Component {

  state = {
    visible: false
  }

  /** 隐藏模态框 */
  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  /** 显示模态框 */
  showModal = () => {
    this.setState({
      visible: true
    })
  }

  /** 确定操作 */
  handleOk = () => {
    const { form: { validateFields }, listRef, currentGoods, selectedRowKeys, onClearSelectedRowKeys } = this.props
    validateFields((err, values) => {
      if (err) return;

      let ids = [];

      if (currentGoods) {
        ids = [currentGoods.id]
      } else if (selectedRowKeys) {
        ids = selectedRowKeys
      }

      if(!ids.length) return message.warn('请至少选择一个人审核')

      unPassGoods({
        ...values,
        ids
      }).then(() => {
        this.setState({
          visible: false
        })
        onClearSelectedRowKeys()
        listRef.fetchData()
      })
    });
  }

  /** 取消操作 */
  handleCancel = () => {
    this.hideModal()
  }

  /** 窗口彻底关闭回调 */
  handleClose = () => {
    this.props.ondestroy();
  }

  render() {
    const { form: { getFieldDecorator }, currentGoods, selectedRowKeys } = this.props
    const { visible } = this.state;

    let title = '审核不通过'

    if (currentGoods) {
      title = `请填写【${currentGoods.productName}】商品不通过原因`
    } else if (selectedRowKeys.length) {
      title = `本次共选择${selectedRowKeys.length}件商品审核不通过`
    }

    return (
      <Modal
        visible={visible}
        title={title}
        okText="确认不通过"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        afterClose={this.handleClose}
      >
        <Form layout="vertical">
          <FormItem label="请输入不通过原因">
            {getFieldDecorator('auditInfo', {
              rules: [{
                required: true,
                message: '请输入不通过原因！'
              }]
            })(
              <TextArea
                placeholder="请输入不通过原因"
                autoSize={{ minRows: 8, maxRows: 20 }}
              />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(UnpassModal)