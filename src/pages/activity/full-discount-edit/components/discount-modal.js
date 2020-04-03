import React, { PureComponent } from 'react'
import { Modal, Form, Radio, InputNumber, Alert } from 'antd'
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
  discountModal: state[namespace].discountModal,
  currentRuleIndex: state[namespace].currentRuleIndex
}))
@Form.create()
class DiscountModal extends PureComponent {
  state = {
    conditionErr: '',
    modeErr: '',
    alertErr: '' // 关联数据大小的错误提示
  }

  handleOk = () => {
    const { form: { validateFields }, onOk, dispatch, discountModal, currentRuleIndex, promotionType } = this.props
    validateFields((err, { condition, mode, stageAmount, stageCount, discountsAmount, discounts }) => {
      if (err) {
        // 发生的错误根据conditionErr 和 modeErr 收集
        const errMap = errMsgs.reduce((pre, next) => {
          if (next.key in err) {
            if (['condition', 'stageAmount', 'stageCount'].includes(next.key)) {
              return {
                ...pre,
                conditionErr: next.key
              }
            } else if (['mode', 'discountsAmount', 'discounts'].includes(next.key)) {
              return {
                ...pre,
                modeErr: next.key
              }
            } else {
              return pre
            }
          } else {
            return pre
          }
        }, {})
        this.setState({
          ...errMap
        })
        return
      }

      if (promotionType === 11 && condition === 1) {
        // 只有优惠条件为满减类型 同时优惠门槛为满x元类型的时候 需要校验优惠的价格不能大于门槛值
        if (stageAmount < discountsAmount) {
          this.setState({
            alertErr: '优惠减免的值不能超过优惠门槛设置的值'
          })
          return
        }
      }

      const record = {
        condition,
        mode
      }

      if (condition === 1) { // 满 X 元
        record.stageAmount = stageAmount
        record.conditionStr = `满 ${stageAmount} 元`
      } else if (condition === 2) { // 满 X 件
        record.stageCount = stageCount
        record.conditionStr = `满 ${stageCount} 件`
      }

      if (mode === 1) { // 减 X 元
        record.discountsAmount = discountsAmount
        record.modeStr = `减 ${discountsAmount} 元`
      } else if (mode === 2) { // 折 X 折
        record.discounts = discounts
        record.modeStr = `折 ${discounts} 折`
      }

      if (onOk) {
        dispatch[namespace].saveDefault({
          discountModal: {
            ...discountModal,
            visible: false,
          }
        })
        onOk(record, currentRuleIndex)
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
      },
      currentRuleIndex: -1
    })
  }

  /* 输入框获取焦点-自动选择radio选项 & 清空另外一边的选项 & 空值的时候设置错误值 */
  handleFocus = (errkey, itemkey, e) => {
    const { setFieldsValue } = this.props.form
    const currentItem = this.getCurrentItem(itemkey)
    this.setState({
      alertErr: ''
    })
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

  /* 输入框失去焦点-空值的时候设置错误值 */
  handleBlur = (errkey, itemkey, e) => {
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
      return
    }

    this.setState({
      [errkey]: ''
    })
  }

  /* 获取errMsgs的当前值 */
  getCurrentItem = (key) => {
    return errMsgs.find(item => item.key === key)
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldsValue
      },
      discountModal,
      currentRuleIndex,
      promotionType, // 11: 满减 12: 满折
      rules = []
    } = this.props
    const { conditionErr, modeErr, alertErr } = this.state
    /* 优惠门槛错误提示 */
    const conditionErrItem = this.getCurrentItem(conditionErr)
    /* 优惠方式错误提示 */
    const modeErrItem = this.getCurrentItem(modeErr)

    let { condition, mode } = getFieldsValue(['condition', 'mode'])
    let stageAmount
    let stageCount
    let discountsAmount
    let discounts

    if (rules.length) {
      if (currentRuleIndex >= 0) {  // 编辑规则的时候 需要设置默认值
        const currentRule = rules[currentRuleIndex]
        condition = condition || currentRule.condition
        mode = mode || currentRule.mode
        stageAmount = currentRule.stageAmount
        stageCount = currentRule.stageCount
        discountsAmount = currentRule.discountsAmount
        discounts = currentRule.discounts
      }
    }

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
                    required: true
                  }
                ],
                initialValue: condition
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
                        required: condition === 1
                      }
                    ],
                    initialValue: stageAmount
                  })(
                    <InputNumber
                      disabled={condition === 2}
                      min={0.01}
                      precision={2}
                      onChange={this.handleInputChange.bind(this, 'conditionErr', 'stageAmount')}
                      onFocus={this.handleFocus.bind(this, 'conditionErr', 'stageAmount')}
                      onBlur={this.handleBlur.bind(this, 'conditionErr', 'stageAmount')}
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
                        required: condition === 2
                      }
                    ],
                    initialValue: stageCount
                  })(
                    <InputNumber
                      disabled={condition === 1}
                      min={1}
                      precision={0}
                      onChange={this.handleInputChange.bind(this, 'conditionErr', 'stageCount')}
                      onFocus={this.handleFocus.bind(this, 'conditionErr', 'stageCount')}
                      onBlur={this.handleBlur.bind(this, 'conditionErr', 'stageCount')}
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
            ['condition', 'stageAmount', 'stageCount'].includes(conditionErrItem.key) &&
            <p style={{ color: 'red', padding: '8px 0 0 30px' }}>{conditionErrItem.msg}</p>
          }
          <h3>优惠方式</h3>
          <div style={{ marginBottom: 0, paddingLeft: 8 }}>
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('mode', {
                rules: [
                  {
                    required: true
                  }
                ],
                initialValue: mode
              })(
                <Radio.Group onChange={this.handleRadioChange.bind(this, 'modeErr', 'mode')}>
                  <Radio
                    disabled={promotionType === 12} // 优惠种类选择满折的时候 禁止选择该选项
                    style={radioStyle}
                    value={1}
                  >
                    减
                </Radio>
                  <Radio
                    disabled={promotionType === 11} // 优惠种类选择满减的时候 禁止选择该选项
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
                        required: mode === 1
                      }
                    ],
                    initialValue: discountsAmount
                  })(
                    <InputNumber
                      disabled={mode === 2 || promotionType === 12} // 优惠方式选择折 或 优惠种类选择满折的时候 禁止选择该选项
                      min={0.01}
                      precision={2}
                      onChange={this.handleInputChange.bind(this, 'modeErr', 'discountsAmount')}
                      onFocus={this.handleFocus.bind(this, 'modeErr', 'discountsAmount')}
                      onBlur={this.handleBlur.bind(this, 'modeErr', 'discountsAmount')}
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
                        required: mode === 2
                      }
                    ],
                    initialValue: discounts
                  })(
                    <InputNumber
                      disabled={mode === 1 || promotionType === 11} // 优惠方式选择减 或 优惠种类选择满减的时候 禁止选择该选项
                      min={0.1}
                      max={9.9}
                      precision={1}
                      onChange={this.handleInputChange.bind(this, 'modeErr', 'discounts')}
                      onFocus={this.handleFocus.bind(this, 'modeErr', 'discounts')}
                      onBlur={this.handleBlur.bind(this, 'modeErr', 'discounts')}
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
            ['mode', 'discountsAmount', 'discounts'].includes(modeErrItem.key) &&
            <p style={{ color: 'red', padding: '8px 0 0 30px' }}>{modeErrItem.msg}</p>
          }
          {
            alertErr && <Alert style={{ marginTop: 16 }} message={alertErr} type="error" />
          }
        </Form>
      </Modal>
    )
  }
}

export default DiscountModal