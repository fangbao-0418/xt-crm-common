import React, { PureComponent } from 'react'
import { Modal, Form, Radio, InputNumber } from 'antd'
import { connect } from '@/util/utils';
import { namespace } from '../model';

const errMsgs = [{
  key: 'condition',
  msg: '请设置优惠门槛'
}, {
  key: 'stageAmount',
  reverse: 'stageCount',
  msg: '请输入优惠门槛金额',
  type: 'condition',
  val: 1
}, {
  key: 'stageCount',
  reverse: 'stageAmount',
  msg: '请输入优惠门槛件数',
  type: 'condition',
  val: 2
}, {
  key: 'mode',
  msg: '请设置优惠方式'
}, {
  key: 'discountsAmount',
  reverse: 'discounts',
  msg: '请输入优惠金额',
  type: 'mode',
  val: 1
}, {
  key: 'discounts',
  reverse: 'discountsAmount',
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
    conditionErr: '',
    modeErr: ''
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
    this.setState({
      conditionErr: '',
      modeErr: ''
    })
    dispatch[namespace].saveDefault({
      discountModal: {
        ...discountModal,
        title: '优惠条件'
      }
    })
  }

  /* 输入框获取焦点-自动选择radio选项 & 清空另外一边的选项 */
  handleFocus = (errkey, itemkey, e) => {
    const { setFieldsValue } = this.props.form
    const currentItem = this.getCurrentItem(itemkey)
    if (currentItem) {
      setFieldsValue({
        [currentItem.type]: currentItem.val,
        [currentItem.reverse]: undefined
      })
    }
    if (e.target.value === '') {
      this.setState({
        [errkey]: itemkey
      })
    }
  }

  /* 单选变化回调-清空另一边的输入框 & 并立马给出报错提示 */
  handleRadioChange = (errkey, itemkey, e) => {
    const { setFieldsValue } = this.props.form
    const val = e.target.value
    const currentItem = errMsgs.find(item => item.type === itemkey && item.val === val)
    if (currentItem) {
      setFieldsValue({
        [currentItem.reverse]: undefined
      })
      this.setState({
        [errkey]: currentItem.key
      })
    }
  }

  /* 输入框变化回调 */
  handleInputChange = (errkey, itemkey, val) => {
    // 没有设置值的话 就设置错误
    if (val === '') {
      this.setState({
        [errkey]: itemkey
      })
    } else {
      this.setState({
        [errkey]: ''
      })
    }
  }

  /* 获取errMsgs的当前值 */
  getCurrentItem = (key) => {
    return errMsgs.find(item => item.key === key)
  }

  render() {
    const {
      form: {
        getFieldDecorator
      },
      discountModal
    } = this.props
    const { conditionErr, modeErr } = this.state

    const conditionErrItem = this.getCurrentItem(conditionErr)
    const modeErrItem = this.getCurrentItem(modeErr)

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
                <Radio.Group onChange={this.handleRadioChange.bind(this, 'conditionErr', 'condition')}>
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
                    <InputNumber
                      onChange={this.handleInputChange.bind(this, 'conditionErr', 'stageAmount')}
                      onFocus={this.handleFocus.bind(this, 'conditionErr', 'stageAmount')}
                    />
                  )
                }
                 &nbsp;元&nbsp;&nbsp;
                 大于0, 小数点后最多2位有效数字
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
                    <InputNumber
                      onChange={this.handleInputChange.bind(this, 'conditionErr', 'stageCount')}
                      onFocus={this.handleFocus.bind(this, 'conditionErr', 'stageCount')}
                    />
                  )
                }
                &nbsp;件&nbsp;&nbsp;
                大于0的整数
              </div>
            </div>
          </div>
          {
            conditionErrItem &&
            ['stageAmount', 'stageCount'].includes(conditionErrItem.key) &&
            <p style={{ color: 'red', padding: '8px 0 0 30px' }}>{conditionErrItem.msg}</p>
          }
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
                <Radio.Group onChange={this.handleRadioChange.bind(this, 'modeErr', 'mode')}>
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
                    <InputNumber
                      onChange={this.handleInputChange.bind(this, 'modeErr', 'discountsAmount')}
                      onFocus={this.handleFocus.bind(this, 'modeErr', 'discountsAmount')}
                    />
                  )
                }
                &nbsp;元&nbsp;&nbsp;
                大于0, 小数点后最多2位有效数字
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
                    <InputNumber
                      onChange={this.handleInputChange.bind(this, 'discounts')}
                      onFocus={this.handleFocus.bind(this, 'modeErr', 'discounts')}
                    />
                  )
                }
                &nbsp;折&nbsp;&nbsp;
                10分制, 大于0小于10, 保留小数点后1位
              </div>
            </div>
          </div>
          {
            modeErrItem &&
            ['discountsAmount', 'discounts'].includes(modeErrItem.key) &&
            <p style={{ color: 'red', padding: '8px 0 0 30px' }}>{modeErrItem.msg}</p>
          }
        </Form>
      </Modal>
    )
  }
}

export default DiscountModal