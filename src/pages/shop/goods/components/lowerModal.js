import React, { Component } from 'react';
import { Modal, Input, Radio } from 'antd';
import Form, { FormItem } from '@/packages/common/components/form';
import { lowerGoods } from '../api';

const { TextArea } = Input;

class LowerModal extends Component {

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
    const { form: { validateFields }, listRef, currentGoods } = this.props
    validateFields((err, values) => {
      if (err) return;
      lowerGoods({
        ...values,
        id: currentGoods.id
      }).then(() => {
        this.setState({
          visible: false
        })
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
    const { form: { getFieldDecorator }, currentGoods } = this.props
    const { visible } = this.state;

    if (!currentGoods) return null;

    return (
      <Modal
        visible={visible}
        title={`确认下架商品【${currentGoods.productName}】吗?`}
        okText="确认"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        afterClose={this.handleClose}
      >
        <Form layout="vertical">
          <FormItem label="是否允许再次上架">
            {getFieldDecorator('isAllowShelves', {
              rules: [{
                required: true,
                message: '请选择！'
              }]
            })(
              <Radio.Group >
                <Radio value={0}>允许</Radio>
                <Radio value={1}>禁止</Radio>
              </Radio.Group>)}
          </FormItem>
          <FormItem label="违规原因">
            {getFieldDecorator('info', {
              rules: [{
                required: true,
                message: '请输入违规原因！'
              }]
            })(
              <TextArea
                placeholder="请输入！"
                autoSize={{ minRows: 8, maxRows: 20 }}
              />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(LowerModal)