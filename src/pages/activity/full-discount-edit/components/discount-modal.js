import React, { PureComponent } from 'react'
import { Modal, Form, Radio, InputNumber } from 'antd'
import { connect } from '@/util/utils';
import { namespace } from '../model';

const errMsgs = [{
  err: 'condition',
  msg: '请设置优惠门槛'
}, {
  err: 'stageAmount',
  msg: '请输入优惠门槛金额',
  type: 'condition',
  val: 1
}, {
  err: 'stageCount',
  msg: '请输入优惠门槛件数',
  type: 'condition',
  val: 2
}, {
  err: 'mode',
  msg: '请设置优惠方式'
}, {
  err: 'discountsAmount',
  msg: '请输入优惠金额',
  type: 'mode',
  val: 1
}, {
  err: 'discountsAmount',
  msg: '请输入优惠件数',
  type: 'mode',
  val: 2
}]

@connect(state => ({
  discountModal: state[namespace].discountModal
}))
@Form.create()
class DiscountModal extends PureComponent {
  state = {
    err: ''
  }

  handleOk = () => {
    const { form: { validateFields }, onOk } = this.props
    validateFields((err, vals) => {
      console.log(err)
      if (err) return
      console.log(vals)
      if (onOk) {
        onOk(vals)
      }
    })
  }

  /* 取消模态框操作 */
  handleCancel = () => {
    const { dispatch, discountModal } = this.props
    dispatch[namespace].saveDefault({
      discountModal: {
        ...discountModal,
        visible: false,
      }
    })
  }

  /* 模态框消失之后回调 */
  handleAfterClose = () => {
    const { dispatch, discountModal } = this.props
    dispatch[namespace].saveDefault({
      discountModal: {
        ...discountModal,
        title: '优惠条件'
      }
    })
  }

  /* 输入框获取焦点 */
  handleFocus = (key) => {
    const { setFieldsValue } = this.props.form
    const currentItem = this.getCurrentItem(key)
    if (currentItem) {
      setFieldsValue({
        [currentItem.type]: currentItem.val
      })
    }
  }

  /* 输入框变化回调 */
  handleInputChange = (key, val) => {
    const { isFieldTouched } = this.props.form
    if (!isFieldTouched(key)) {
      return
    }
    if (val === '') {
      this.setState({
        err: key
      })
      return
    }
  }

  getCurrentItem = (key) => {
    return errMsgs.find(item => item.err === key)
  }

  render() {
    const {
      form: {
        getFieldDecorator
      },
      discountModal
    } = this.props

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <Modal
        title={discountModal.title}
        visible={discountModal.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        afterClose={this.handleAfterClose}
        destroyOnClose
      >
        <Form layout="vertical">
          <h3 style={{ marginTop: 0 }}>优惠门槛</h3>
          <div style={{ marginBottom: 0, paddingLeft: 8 }}>
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('condition', {
                rules: [
                  {
                    required: true,
                    message: '请设置优惠门槛',
                  }
                ]
              })(
                <Radio.Group>
                  <Radio
                    style={radioStyle}
                    value={1}
                  >
                    满
                </Radio>
                  <Radio
                    style={{
                      ...radioStyle,
                      marginTop: 16
                    }}
                    value={2}
                  >
                    满
                </Radio>
                </Radio.Group>
              )}
            </div>
            <div style={{ display: 'inline-block' }}>
              <div>
                {
                  getFieldDecorator('stageAmount', {
                    rules: [
                      {
                        required: true,
                        message: '请输入优惠门槛金额',
                      }
                    ]
                  })(
                    <div>
                      <InputNumber 
                        onChange={this.handleInputChange.bind(this, 'stageAmount')}
                        onFocus={this.handleFocus.bind(this, 'stageAmount')}
                      />
                      &nbsp;元&nbsp;&nbsp;
                      大于0, 小数点后最多2位有效数字
                    </div>
                  )
                }
              </div>
              <div style={{ marginTop: 16 }}>
                {
                  getFieldDecorator('stageCount', {
                    rules: [
                      {
                        required: true,
                        message: '请输入优惠门槛件数',
                      }
                    ]
                  })(
                    <div>
                      <InputNumber />&nbsp;件&nbsp;&nbsp;
                      大于0的整数
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          <h3>优惠方式</h3>
          <div style={{ marginBottom: 0, paddingLeft: 8 }}>
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('mode', {
                rules: [
                  {
                    required: true,
                    message: '请设置优惠方式',
                  }
                ]
              })(
                <Radio.Group>
                  <Radio
                    style={radioStyle}
                    value={1}
                  >
                    减
                </Radio>
                  <Radio
                    style={{
                      ...radioStyle,
                      marginTop: 16
                    }}
                    value={2}
                  >
                    折
                </Radio>
                </Radio.Group>
              )}
            </div>
            <div style={{ display: 'inline-block' }}>
              <div>
                {
                  getFieldDecorator('discountsAmount', {
                    rules: [
                      {
                        required: true,
                        message: '请输入优惠金额'
                      }
                    ]
                  })(
                    <div>
                      <InputNumber />&nbsp;元&nbsp;&nbsp;
                      大于0, 小数点后最多2位有效数字
                    </div>
                  )
                }
              </div>
              <div style={{ marginTop: 16 }}>
                {
                  getFieldDecorator('discounts', {
                    rules: [
                      {
                        required: true,
                        message: '请输入优惠件数'
                      }
                    ]
                  })(
                    <div>
                      <InputNumber />&nbsp;折&nbsp;&nbsp;
                      10分制, 大于0小于10, 保留小数点后1位
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    )
  }
}

export default DiscountModal