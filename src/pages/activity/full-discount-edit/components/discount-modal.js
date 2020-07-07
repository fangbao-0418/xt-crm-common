import React, { PureComponent } from 'react'
import { Modal, Form, Radio, InputNumber, Alert } from 'antd'
import { connect } from '@/util/utils'
import { namespace } from '../model'

const errMsgs = [{
  key: 'stageType',
  msg: '请设置优惠门槛'
}, {
  key: 'stageAmount',
  reverse: ['stageCount'],
  msg: '请输入优惠门槛金额',
  type: 'stageType',
  val: 1
}, {
  key: 'stageCount',
  reverse: ['stageAmount'],
  msg: '请输入优惠门槛件数',
  type: 'stageType',
  val: 2
}, {
  key: 'mode',
  msg: '请设置优惠方式'
}, {
  key: 'discountsAmount',
  reverse: ['discounts', 'amount'],
  msg: '请输入优惠金额',
  type: 'mode',
  val: 1
}, {
  key: 'discounts',
  reverse: ['discountsAmount', 'amount'],
  msg: '请输入优惠折扣',
  type: 'mode',
  val: 2
}, {
  key: 'amount',
  reverse: ['discounts', 'discountsAmount'],
  msg: '请输入优惠金额',
  type: 'mode',
  val: 3
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
    const {
      form: { validateFields },
      onOk,
      dispatch,
      discountModal,
      promotionType
    } = this.props
    validateFields((err, { stageType, mode, stageAmount, stageCount, discountsAmount, discounts, amount }) => {
      if (err) {
        // 发生的错误根据conditionErr 和 modeErr 收集
        const errMap = errMsgs.reduce((pre, next) => {
          if (next.key in err) {
            if (['stageType', 'stageAmount', 'stageCount'].includes(next.key)) {
              return {
                ...pre,
                conditionErr: next.key
              }
            } else if (['mode', 'discountsAmount', 'discounts'].includes(next.key)) {
              return {
                ...pre,
                modeErr: next.key
              }
            } else if (['mode', 'discountsAmount', 'amount'].includes(next.key)) {
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

      if (promotionType === 11 && stageType === 1) {
        // 只有优惠条件为满减类型 同时优惠门槛为满x元类型的时候 需要校验优惠的价格不能大于等于门槛值
        if (stageAmount <= discountsAmount) {
          this.setState({
            alertErr: '优惠减免的值必须小于优惠门槛设置的值'
          })
          return
        }
      }

      const record = {
        stageType,
        mode
      }

      if (stageType === 1) { // 满 X 元
        record.stageAmount = stageAmount
        record.conditionStr = `满 ${stageAmount} 元`
      } else if (stageType === 2) { // 满 X 件
        record.stageCount = stageCount
        record.conditionStr = `满 ${stageCount} 件`
      }

      if (mode === 1) { // 减 X 元
        record.discountsAmount = discountsAmount
        record.modeStr = `减 ${discountsAmount} 元`
      } else if (mode === 2) { // 折 X 折
        record.discounts = discounts
        record.modeStr = `折 ${discounts} 折`
      } else if (mode === 3) { // 减 X 元
        record.amount = amount
        record.modeStr = `${amount} 元购买`
      }

      if (onOk) {
        dispatch[namespace].saveDefault({
          discountModal: {
            ...discountModal,
            visible: false
          }
        })

        onOk(record)
      }
    })
  }

  /* 取消模态框操作 */
  handleCancel = () => {
    const { dispatch, discountModal } = this.props
    dispatch[namespace].saveDefault({
      discountModal: {
        ...discountModal,
        visible: false
      }
    })
  }

  /* 模态框消失之后回调 */
  handleAfterClose = () => {
    const { dispatch, discountModal } = this.props
    this.setState({
      conditionErr: '',
      modeErr: '',
      alertErr: ''
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
        ...(currentItem.reverse.reduce((pre, next) => ({ ...pre, ['next']: undefined }), {}))
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
        ...(currentItem.reverse.reduce((pre, next) => ({ ...pre, ['next']: undefined }), {}))
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

  render () {
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

    let { stageType, mode } = getFieldsValue(['stageType', 'mode'])
    let stageAmount
    let stageCount
    let discountsAmount
    let discounts
    let amount

    if (rules.length) {
      if (currentRuleIndex >= 0) { // 编辑规则的时候 需要设置默认值
        const currentRule = rules[currentRuleIndex]
        stageType = stageType || currentRule.stageType
        mode = mode || currentRule.mode
        stageAmount = currentRule.stageAmount
        stageCount = currentRule.stageCount
        discountsAmount = currentRule.discountsAmount
        discounts = currentRule.discounts
        amount = currentRule.amount
      }
    }

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px'
    }

    return (
      <Modal
        title={discountModal.title}
        visible={discountModal.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        afterClose={this.handleAfterClose}
        destroyOnClose
      >
        <Form layout='vertical'>
          <h3 style={{ marginTop: 0 }}>优惠门槛</h3>
          <div style={{ marginBottom: 0, paddingLeft: 8 }}>
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('stageType', {
                rules: [
                  {
                    required: true
                  }
                ],
                initialValue: stageType
              })(
                <Radio.Group onChange={this.handleRadioChange.bind(this, 'conditionErr', 'stageType')}>
                  <Radio
                    disabled=
                      {
                        (promotionType === 13)
                        || (rules && rules[0] && rules[0].stageType === 2 || false)
                      } // 第一次选择 满x件类型 的话 第二次以上配置禁止该选项选择
                    style={radioStyle}
                    value={1}
                  >
                    满
                  </Radio>
                  <Radio
                    disabled={
                      (promotionType === 11)
                      || (rules && rules[0] && rules[0].stageType === 1 || false)
                    } // 满减 一口价的时候禁止该选项 第一次选择 满x元类型 的话 第二次以上配置禁止该选项选择
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
                        required: stageType === 1
                      }
                    ],
                    initialValue: stageAmount
                  })(
                    <InputNumber
                      disabled={
                        (promotionType === 13)
                        || (stageType === 2)
                        || (rules && rules[0] && rules[0].stageType === 2 || false)
                      }
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
                        required: stageType === 2
                      }
                    ],
                    initialValue: stageCount
                  })(
                    <InputNumber
                      disabled={
                        (promotionType === 11)
                        || stageType === 1
                        || (rules && rules[0] && rules[0].stageType === 1 || false)
                      }
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
            conditionErrItem
            && ['stageType', 'stageAmount', 'stageCount'].includes(conditionErrItem.key)
            && <p style={{ color: 'red', padding: '8px 0 0 30px' }}>{conditionErrItem.msg}</p>
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
                    disabled={[12, 13].includes(promotionType)} // 优惠种类选择满折 多件一口价的时候 禁止选择该选项
                    style={radioStyle}
                    value={1}
                  >
                    减
                  </Radio>
                  <Radio
                    disabled={[11, 13].includes(promotionType)} // 优惠种类选择满减 多件一口价的时候 禁止选择该选项
                    style={{
                      ...radioStyle,
                      marginTop: 16
                    }}
                    value={2}
                  >
                    打
                  </Radio>
                  <Radio
                    disabled={[11, 12].includes(promotionType)} // 优惠种类选择满减 满折的时候 禁止选择该选项
                    style={{
                      ...radioStyle,
                      marginTop: 16
                    }}
                    value={3}
                  >
                    售
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
                      disabled={mode === 2 || [12, 13].includes(promotionType)} // 优惠方式选择折 或 优惠种类选择满折的时候 禁止选择该选项
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
                      disabled={mode === 1 || [11, 13].includes(promotionType)} // 优惠方式选择减 或 优惠种类选择满减的时候 禁止选择该选项
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
              <div style={{ marginTop: 16 }}>
                {
                  getFieldDecorator('amount', {
                    rules: [
                      {
                        required: mode === 2
                      }
                    ],
                    initialValue: amount
                  })(
                    <InputNumber
                      disabled={mode === 1 || [11, 12].includes(promotionType)} // 优惠方式选择减 或 优惠种类选择满减 满折的时候 禁止选择该选项
                      min={0.01}
                      precision={2}
                      onChange={this.handleInputChange.bind(this, 'modeErr', 'amount')}
                      onFocus={this.handleFocus.bind(this, 'modeErr', 'amount')}
                      onBlur={this.handleBlur.bind(this, 'modeErr', 'amount')}
                    />
                  )
                }
                &nbsp;元&nbsp;&nbsp;
                大于0, 小数点后最多2位有效数字
              </div>
            </div>
          </div>
          {
            modeErrItem
            && ['mode', 'discountsAmount', 'discounts', 'amount'].includes(modeErrItem.key)
            && <p style={{ color: 'red', padding: '8px 0 0 30px' }}>{modeErrItem.msg}</p>
          }
          {
            alertErr && <Alert style={{ marginTop: 16 }} message={alertErr} type='error' />
          }
        </Form>
      </Modal>
    )
  }
}

export default DiscountModal