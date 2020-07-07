import React, { PureComponent } from 'react'
import { Card, Form, Input, DatePicker, Radio, Button, InputNumber } from 'antd'
import moment from 'moment'
import { If } from '@/packages/common/components'
import RulesTable from './components/rules-table'
import ProductTable from './components/product-table'
import { formatMoneyWithSign } from '@/pages/helper'
import { gotoPage, connect } from '@/util/utils'
import { namespace } from './model'
import { detailFullDiscounts } from './api'

const { RangePicker } = DatePicker
const { TextArea } = Input

const getExceptionStr = (list) => {
  console.log(list)
  if (list.length < 2) {
    return false
  }
  for (let i = 0, l = list.length - 1; i < l; i++) {
    const curItem = list[i]
    const nextItem = list[i + 1]
    if (curItem.stageType === 1) { // 满 x 元
      if (curItem.stageAmount >= nextItem.stageAmount) {
        return `第 ${i + 2} 级的配置必须高于第 ${i + 1} 级的配置(优惠门槛: 高阶梯的满X元必须大于低阶梯的满X元)`
      }
    } else if (curItem.stageType === 2) { // 满 x 件
      if (curItem.stageCount >= nextItem.stageCount) {
        return `第 ${i + 2} 级的配置必须高于第 ${i + 1} 级的配置(优惠门槛: 高阶梯的满X件必须大于低阶梯的满X件)`
      }
    }

    if (curItem.mode === 1) { // 减 x 元
      if (curItem.discountsAmount >= nextItem.discountsAmount) {
        return `第 ${i + 2} 级的配置必须高于第 ${i + 1} 级的配置(优惠方式: 高阶梯的减X元必须大于低阶梯的减X元)`
      }
    } else if (curItem.mode === 2) { // 折 x 折
      if (curItem.discounts <= nextItem.discounts) {
        return `第 ${i + 2} 级的配置必须高于第 ${i + 1} 级的配置(优惠方式: 高阶梯的打折优惠力度必须大于低阶梯)`
      }
    } else if (curItem.mode === 3) { // 减 x 元
      if (curItem.amount >= nextItem.amount) {
        return `第 ${i + 2} 级的配置必须高于第 ${i + 1} 级的配置(优惠方式: 高阶梯的减X元必须大于低阶梯的减X元)`
      }
    }
  }
  return false
}

@connect(state => ({
  goodsModal: state[namespace].goodsModal,
  activityModal: state[namespace].activityModal,
  preRulesMaps: state[namespace].preRulesMaps,
  preProductRefMaps: state[namespace].preProductRefMaps
}))
@Form.create({
  onValuesChange: (props, changedValues) => {
    const { ruleType, maxDiscountsAmount, maxDiscountsCount, rules, overlayCoupon } = changedValues
    const { getFieldValue, setFieldsValue } = props.form
    const productRefInfo = getFieldValue('productRefInfo')
    const promotionType = getFieldValue('promotionType')

    if (('promotionType' in changedValues)) {
      return
    }

    if (productRefInfo && productRefInfo.length && promotionType === 13) {
      if ([ruleType, maxDiscountsAmount, maxDiscountsCount, rules, overlayCoupon].some(item => item !== undefined)) {
        console.log(999)
        setFieldsValue({
          productRefInfo: []
        })
      }
    }
  }
})
class FullDiscountEditPage extends PureComponent {
  state = {
    detail: null
  }

  componentWillUnmount () {
    const { dispatch } = this.props
    // 这里需要重置preRulesMaps 和 preProductRefMaps的值，否则下次进入该页面会保留之前的数据
    dispatch[namespace].saveDefault({
      preRulesMaps: {},
      preProductRefMaps: {}
    })
  }

  componentDidMount () {
    const { match: { params: { id, action } }, form: { setFieldsValue } } = this.props
    if (!id) {
      return
    }
    if (action === 'copy' || action === 'edit') {
      detailFullDiscounts(id).then(detail => {
        this.setState({
          detail
        })
        const fieldsValue = {
          title: detail.title,
          time: [moment(detail.startTime), moment(detail.endTime)],
          promotionType: detail.promotionType,
          productRef: detail.productRef,
          promotionDesc: detail.promotionDesc
        }

        if (detail.rule) {
          const rule = detail.rule
          let rules = []
          fieldsValue.ruleType = rule.ruleType
          if (rule.ruleType === 0) { // 每满减的时候设置封顶值
            fieldsValue.maxDiscountsAmount = rule.maxDiscountsAmount / 100
          }
          if (detail.promotionType === 11) { // 满减
            rules = rule.amountRuleList.map(item => {
              if (detail.stageType === 1) { // 满 x 元
                return {
                  ...item,
                  stageType: detail.stageType,
                  mode: 1,
                  discountsAmount: item.discountsAmount / 100,
                  stageAmount: item.stageAmount / 100,
                  conditionStr: `满 ${formatMoneyWithSign(item.stageAmount)} 元`,
                  modeStr: `减 ${formatMoneyWithSign(item.discountsAmount)} 元`
                }
              } else if (detail.stageType === 2) { // 满 x 件
                return {
                  ...item,
                  stageType: detail.stageType,
                  mode: 1,
                  discountsAmount: item.discountsAmount / 100,
                  conditionStr: `满 ${item.stageCount} 件`,
                  modeStr: `减 ${formatMoneyWithSign(item.discountsAmount)} 元`
                }
              } else {
                return item
              }
            })
          } else if (detail.promotionType === 12) { // 满折
            rules = rule.discountsRuleList.map(item => {
              if (detail.stageType === 1) { // 满 x 元
                return {
                  ...item,
                  stageType: detail.stageType,
                  mode: 2,
                  discounts: item.discounts / 10,
                  stageAmount: item.stageAmount / 100,
                  conditionStr: `满 ${formatMoneyWithSign(item.stageAmount)} 元`,
                  modeStr: `打 ${item.discounts / 10} 折`
                }
              } else if (detail.stageType === 2) { // 满 x 件
                return {
                  ...item,
                  stageType: detail.stageType,
                  mode: 2,
                  discounts: item.discounts / 10,
                  conditionStr: `满 ${item.stageCount} 件`,
                  modeStr: `打 ${item.discounts / 10} 折`
                }
              } else {
                return item
              }
            })
          } else if (detail.promotionType === 13) {
            rules = rule.discountsRuleList.map(item => {
              return {
                ...item,
                stageType: detail.stageType,
                mode: 3,
                amount: item.amount / 100,
                conditionStr: `满 ${item.stageCount} 件`,
                modeStr: `打 ${item.amount / 10} 折`
              }
            })
          }
          fieldsValue.rules = rules
        }

        if (detail.productRef === 1) {
          fieldsValue.productRefInfo = detail.referenceProductVO
        } else if (detail.productRef === 0) {
          fieldsValue.productRefInfo = [detail.refPromotion]
        }

        setFieldsValue(fieldsValue)
      })
    }
  }

  /* 保存操作 */
  handleSave = () => {
    const {
      form: {
        validateFields
      },
      dispatch,
      match: { params: { id, action } }
    } = this.props
    validateFields((err, filds) => {
      if (err) {
        return
      }
      // api: http://192.168.20.21/project/278/interface/api/50540
      const {
        title, // 活动名称
        time, // 活动时间
        promotionType, // 优惠种类
        productRef, // 活动商品
        productRefInfo, // 关联活动商品
        promotionDesc // 活动说明
      } = filds
      const params = {
        title,
        startTime: time[0].valueOf(),
        endTime: time[1].valueOf(),
        promotionType,
        productRef,
        promotionDesc,
        sort: 1,
        ...(this.getPromotionRule(filds))
      }

      if (productRef === 0) { // 指定活动
        params.refPromotionId = productRefInfo[0].id
      } else if (productRef === 1) { // 指定商品
        params.refProductIds = productRefInfo.map(item => item.id)
      }

      if (action === 'copy' || (!id)) { // 复制或者新建
        dispatch[namespace].addFullDiscounts(params)
      } else { // 编辑
        dispatch[namespace].updateFullDiscounts({
          ...params,
          id
        })
      }
    })
  }

  getPromotionRule = (filds) => {
    const { promotionType, ruleType, maxDiscountsAmount, maxDiscountsCount, rules, overlayCoupon } = filds
    const params = {
      promotionType,
      rule: {
        ruleType,
        overlayCoupon
      }
    }

    if (promotionType === 11) { // 满减
      params.rule.amountDiscountsRules = rules.map(item => {
        if (params.rule.stageType === undefined) {
          params.rule.stageType = item.stageType
        }
        if (item.stageType === 1) { // 满 x 元
          return {
            discountsAmount: item.discountsAmount * 10 * 10,
            stageAmount: item.stageAmount * 10 * 10
          }
        } else if (item.stageType === 2) { // 满 x 件
          return {
            discountsAmount: item.discountsAmount * 10 * 10,
            stageCount: item.stageCount
          }
        } else {
          return null
        }
      })
    } else if (promotionType === 12) { // 满折
      params.rule.discountsRules = rules.map(item => {
        if (params.rule.stageType === undefined) {
          params.rule.stageType = item.stageType
        }
        if (item.stageType === 1) { // 满 x 元
          return {
            discounts: item.discounts * 10,
            stageAmount: item.stageAmount * 10 * 10
          }
        } else if (item.stageType === 2) { // 满 x 件
          return {
            discounts: item.discounts * 10,
            stageCount: item.stageCount
          }
        } else {
          return null
        }
      })
    } else if (promotionType === 13) {
      params.rule.onePriceDiscountsRules = rules.map(item => {
        if (params.rule.stageType === undefined) {
          params.rule.stageType = item.stageType
        }
        return {
          amount: item.amount * 10 * 10,
          stageCount: item.stageCount
        }
      })
    }

    if (ruleType === 0) {
      if (promotionType === 11) { // 满减
        params.rule.maxDiscountsAmount = maxDiscountsAmount * 10 * 10
      } else if (promotionType === 13) { // 一口价
        params.rule.maxDiscountsCount = maxDiscountsCount
      }
    }

    return params
  }

  /* 返回操作 */
  handleBack = () => {
    gotoPage('/activity/full-discount')
  }

  /* 优惠种类选项变化的时候-自动设置优惠类型为阶梯满 & 清空满减选项关联的满减封顶数值 */
  handlePromotionTypeChange = (e) => {
    const { form: { setFieldsValue, getFieldValue }, preRulesMaps, dispatch } = this.props
    const rules = getFieldValue('rules')
    const ruleType = getFieldValue('ruleType')
    const promotionType = e.target.value
    if ((promotionType === 11) && (ruleType !== undefined)) {
      // 选择满减 设置值为上一次满减的值 然后把满折数据储存起来 以备下次切换使用
      setFieldsValue({
        rules: preRulesMaps[`11-${ruleType}`] || []
      })
      dispatch[namespace].saveDefault({
        preRulesMaps: {
          ...preRulesMaps,
          [`12-${ruleType}`]: rules
        }
      })
    } else if ((promotionType === 12) && (ruleType !== undefined)) {
      // 选择满折 设置值为上一次满折的值 然后把满减数据储存起来 以备下次切换使用
      setFieldsValue({ // 优惠类型已经选择每满减的时候 因为禁止这种组合 所以需要清空数据
        rules: ruleType === 0 ? [] : (preRulesMaps[`12-${ruleType}`] || []),
        ruleType: ruleType === 0 ? undefined : ruleType,
        maxDiscountsAmount: undefined
      })
      dispatch[namespace].saveDefault({
        preRulesMaps: {
          ...preRulesMaps,
          [`11-${ruleType}`]: rules
        }
      })
    }
  }

  /* 优惠类型选项变化的时候-清空满减选项关联的满减封顶数值 */
  handleRuleTypeChange = (e) => {
    const { form: { setFieldsValue, getFieldValue }, preRulesMaps, dispatch } = this.props
    const rules = getFieldValue('rules')
    const promotionType = getFieldValue('promotionType')
    const ruleType = e.target.value
    if ((ruleType === 1) && promotionType !== undefined) {
      // 选择阶梯满的时候 设置为上一次阶梯满组合的值 然后把每满减的数据储存起来 以备下次切换使用
      setFieldsValue({
        rules: preRulesMaps[`${promotionType}-1`] || [],
        maxDiscountsAmount: undefined
      })
      dispatch[namespace].saveDefault({
        preRulesMaps: {
          ...preRulesMaps,
          [`${promotionType}-0`]: rules
        }
      })
    } else if (ruleType === 0) {
      // 选择每满减的时候 设置为上一次每满减组合的值 然后把阶梯满的数据储存起来 以备下次切换使用
      setFieldsValue({
        rules: preRulesMaps[`${promotionType}-0`] || []
      })
      dispatch[namespace].saveDefault({
        preRulesMaps: {
          ...preRulesMaps,
          [`${promotionType}-1`]: rules
        }
      })
    }
  }

  /* 活动商品变化 */
  handleProductRefChange = (e) => {
    const { form: { getFieldValue, setFieldsValue }, preProductRefMaps, dispatch } = this.props
    const productRefInfo = getFieldValue('productRefInfo')
    const value = e.target.value
    if (value === 0) {
      // 选择活动 设置值为上一次选择活动有的值 那么把商品暂时储存起来
      setFieldsValue({
        productRefInfo: preProductRefMaps['0'] || []
      }, () => {
        dispatch[namespace].saveDefault({
          preProductRefMaps: {
            ...preProductRefMaps,
            // '1': productRefInfo
            '1': []
          }
        })
      })
    } else if (value === 1) {
      // 选择商品 设置值为上一次选商品有的值 那么把活动暂时储存起来
      setFieldsValue({
        productRefInfo: preProductRefMaps['1'] || []
      }, () => {
        dispatch[namespace].saveDefault({
          preProductRefMaps: {
            ...preProductRefMaps,
            // '0': productRefInfo
            '0': []
          }
        })
      })
    }
  }

  /* 最大优惠金额设置变化 */
  handleMaxDiscountsAmountChange = () => {
    const { form: { getFieldValue, setFieldsValue } } = this.props
    const rules = getFieldValue('rules')
    const ruleType = getFieldValue('ruleType')
    // 优惠类型设置为每满减 且 优惠条件已经设置了的话 再来重新调整最大优惠金额 需要判断最大金额的限制 因为form收集报错的缘故 这边重新设置一下rules会清理假如rule不合法的报错提示
    if (rules.length && ruleType === 0) {
      setFieldsValue({
        rules
      })
    }
  }

  /* 最大优惠件设置变化 */
  handleMaxDiscountsCountChange = () => {
    const { form: { getFieldValue, setFieldsValue } } = this.props
    const rules = getFieldValue('rules')
    const ruleType = getFieldValue('ruleType')
    // 优惠类型设置为每满减 且 优惠条件已经设置了的话 再来重新调整最大优惠金额 需要判断最大金额的限制 因为form收集报错的缘故 这边重新设置一下rules会清理假如rule不合法的报错提示
    if (rules.length && ruleType === 0) {
      setFieldsValue({
        rules
      })
    }
  }

  /* 优惠条件设置变化 */
  handleRulesChange = () => {
    const { form: { getFieldValue, setFieldsValue } } = this.props
    const ruleType = getFieldValue('ruleType')
    const maxDiscountsAmount = getFieldValue('maxDiscountsAmount')
    // 优惠类型设置为每满减 且 设置了最大金额 那么假如最大优惠金额比优惠条件设置的最大优惠小的话 这个时候 可能最大优惠金额会报错误提示 此时rules设置变化了 就要把错误提示转嫁到rules过来 清除 maxDiscountsAmount 的错误提示
    if (ruleType === 0 && maxDiscountsAmount) {
      setFieldsValue({
        maxDiscountsAmount
      })
    }
  }

  render () {
    const { form: { getFieldDecorator, getFieldValue, getFieldsValue, validateFields }, match: { params: { action } } } = this.props
    const { detail } = this.state

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    }

    const formTailLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    }

    const promotionType = getFieldValue('promotionType')
    const ruleType = getFieldValue('ruleType')
    const productRef = getFieldValue('productRef')
    const rules = getFieldValue('rules')
    const maxDiscountsAmount = getFieldValue('maxDiscountsAmount')
    const maxDiscountsCount = getFieldValue('maxDiscountsCount')

    /* 未开始( 1 )的活动可以编辑全部信息 进行中( 2 )的活动只可以编辑活动商品 已结束( 3 )和已关闭( 0 )的活动不可编辑全部信息 */
    let goodsDisable = false
    let otherDisable = false

    if (detail && action === 'edit') {
      if (detail.discountsStatus === 2) {
        otherDisable = true
      } else if ([3, 0].includes(detail.discountsStatus)) {
        goodsDisable = true
        otherDisable = true
      }
    }

    return (
      <Card
        bordered={false}
        title='添加活动'
        extra={<span onClick={this.handleBack} className='href'>返回</span>}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Card type='inner' title='基本信息'>
            <Form.Item label='活动名称'>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入活动名称(限16个字符)',
                    max: 16
                  }
                ]
              })(
                <Input disabled={otherDisable} style={{ maxWidth: 350 }} placeholder='限16个字符' />
              )}
            </Form.Item>
            <Form.Item label='活动时间'>
              {getFieldDecorator('time', {
                rules: [
                  {
                    required: true,
                    message: '请选择活动时间'
                  }
                ]
              })(
                <RangePicker
                  disabled={otherDisable}
                  showTime={{ format: 'HH:mm:ss' }}
                  format='YYYY-MM-DD HH:mm:ss'
                  placeholder={['开始时间', '结束时间']}
                />
              )}
            </Form.Item>
          </Card>
          <Card
            style={{ marginTop: 16 }}
            type='inner'
            title='优惠信息'
          >
            <Form.Item label='优惠种类'>
              {getFieldDecorator('promotionType', {
                rules: [
                  {
                    required: true,
                    message: '请选择优惠种类'
                  }
                ]
              })(
                <Radio.Group disabled={otherDisable} onChange={this.handlePromotionTypeChange}>
                  <Radio value={11}>满减</Radio>
                  <Radio value={12}>满折</Radio>
                  <Radio value={13}>多件一口价</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label='优惠类型'>
              {getFieldDecorator('ruleType', {
                rules: [
                  {
                    required: true,
                    message: '请选择至少一项优惠类型'
                  }
                ]
              })(
                <Radio.Group disabled={otherDisable} onChange={this.handleRuleTypeChange}>
                  <Radio value={1}>
                    阶梯满
                  </Radio>
                  <Radio disabled={promotionType === 12} value={0}>
                    每满减
                  </Radio>
                </Radio.Group>
              )}
              {/* 满减满折的时候显示最大封顶元 */}
              <If condition={promotionType === 11 || promotionType === 12}>
                <Form.Item style={{ display: 'inline-block', marginBottom: 0 }}>
                  {
                    getFieldDecorator('maxDiscountsAmount',
                      {
                        rules: [{
                          validator: (_, value, callback) => {
                            if (!value) {
                              callback()
                            }
                            if (rules.length && ruleType === 0) {
                              const currentMaxDiscountsAmount = Math.max(...(rules.map(item => item.discountsAmount)))
                              if (currentMaxDiscountsAmount > value) {
                                callback('最大优惠值必须大于已经设置的优惠条件中的最大优惠值')
                              } else {
                                callback()
                              }
                            } else {
                              callback()
                            }
                          }
                        }]
                      })(
                      <InputNumber
                        onChange={this.handleMaxDiscountsAmountChange}
                        min={0}
                        precision={2}
                        {...(
                        /* 解决不必选的时候也会出现报错样式的bug */
                          ruleType !== 0 ? {
                            style: {
                              borderColor: '#d9d9d9'
                            }
                          } : null
                        )}
                        disabled={ruleType !== 0 || otherDisable}
                      />
                    )
                  }
                &nbsp;元封顶，0 元表示不封顶
                </Form.Item>
              </If>
              {/* 满减满折的时候显示最大封顶件 */}
              <If condition={promotionType === 13}>
                <Form.Item style={{ display: 'inline-block', marginBottom: 0 }}>
                  {
                    getFieldDecorator('maxDiscountsCount',
                      {
                        rules: [{
                          validator: (_, value, callback) => {
                            if (!value) {
                              callback()
                            }
                            if (rules.length && ruleType === 0) {
                              if ([11, 12].includes(promotionType)) { // 满减 满折
                                const currentMaxDiscountsCount = Math.max(...(rules.map(item => item.discountsAmount)))
                                if (currentMaxDiscountsCount > value) {
                                  callback('最大优惠值必须大于已经设置的优惠条件中的最大优惠值')
                                } else {
                                  callback()
                                }
                              } else if (promotionType === 13) { // 一口价
                                const currentMaxStageCount = Math.max(...(rules.map(item => item.stageCount)))
                                if (currentMaxStageCount > value) {
                                  callback('最大优惠值必须大于已经设置的优惠条件中的最大优惠值')
                                } else {
                                  callback()
                                }
                              }

                            } else {
                              callback()
                            }
                          }
                        }]
                      })(
                      <InputNumber
                        onChange={this.handleMaxDiscountsCountChange}
                        min={0}
                        precision={0}
                        {...(
                        /* 解决不必选的时候也会出现报错样式的bug */
                          ruleType !== 0 ? {
                            style: {
                              borderColor: '#d9d9d9'
                            }
                          } : null
                        )}
                        disabled={ruleType !== 0 || otherDisable}
                      />
                    )
                  }
                &nbsp;件封顶，0件表示不封顶
                </Form.Item>
              </If>
            </Form.Item>
            <Form.Item label='是否可叠加优惠券'>
              {getFieldDecorator('overlayCoupon', {
                rules: [
                  {
                    required: true,
                    message: '请选择是否可叠加优惠券'
                  }
                ]
              })(
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label='优惠条件'>
              {
                getFieldDecorator('rules', {
                  rules: [{
                    required: true,
                    validateTrigger: ['onChange', 'onBlur'],
                    validator: (_, value, callback) => {
                      if (!value.length) {
                        callback('请添加优惠条件')
                        return
                      }
                      if (ruleType === 0) {
                        if (promotionType === 11 && maxDiscountsAmount > 0) {
                          // 优惠种类为满减的时候且优惠类型每满减的时候且设置了最大优惠值的时候, 后面的最大优惠不能超过设置的maxDiscountsAmount最大优惠值
                          const currentMaxDiscountsAmount = Math.max(...(value.map(item => item.discountsAmount)))
                          if (currentMaxDiscountsAmount > maxDiscountsAmount) {
                            callback('优惠金额不能超过已设置的最大优惠金额: ' + maxDiscountsAmount + ' 元')
                            return
                          }
                        } else if (promotionType === 13 && maxDiscountsCount > 0) {
                          const currentMaxStageCount = Math.max(...(value.map(item => item.stageCount)))
                          if (currentMaxStageCount > maxDiscountsCount) {
                            callback('优惠件数不能超过已设置的最大优惠件数: ' + maxDiscountsCount + ' 件')
                            return
                          }
                        }
                      }

                      if (getExceptionStr(value)) {
                        callback(getExceptionStr(value))
                      }
                      callback()
                    }
                  }],
                  initialValue: []
                })(
                  <RulesTable
                    onChange={this.handleRulesChange}
                    disabled={otherDisable}
                    promotionType={promotionType}
                    ruleType={ruleType}
                  />
                )
              }
            </Form.Item>
          </Card>
          <Card
            style={{ marginTop: 16 }}
            type='inner'
            title='活动商品'
          >
            <Form.Item label='活动商品'>
              {getFieldDecorator('productRef', {
                rules: [{
                  required: true,
                  message: '请选择活动商品'
                }]
              })(
                <Radio.Group
                  disabled={goodsDisable}
                  onChange={this.handleProductRefChange}
                >
                  <Radio value={1}>指定商品</Radio>
                  {/* <Radio value={0}>指定活动</Radio> */}
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label='选择关联'>
              {getFieldDecorator('productRefInfo', {
                rules: [{
                  required: true,
                  validator: (_, value, callback) => {
                    if (value.length) {
                      callback()
                    } else {
                      callback('请选择关联活动/商品')
                    }
                  }
                }],
                initialValue: []
              })(
                <ProductTable
                  validateFields={validateFields}
                  rules={this.getPromotionRule(getFieldsValue())}
                  promotionType={promotionType}
                  disabled={goodsDisable}
                  productRef={productRef}
                />
              )}
            </Form.Item>
          </Card>
          <Card
            style={{ marginTop: 16 }}
            type='inner'
            title='活动说明'
          >
            <Form.Item label='活动说明'>
              {getFieldDecorator('promotionDesc', {
                rules: [
                  {
                    required: false,
                    whitespace: true,
                    message: '请输入活动说明(限100个字符)',
                    max: 100
                  }
                ]
              })(
                <TextArea
                  disabled={otherDisable}
                  style={{ maxWidth: 350 }}
                  placeholder='显示在用户端, 建议填写活动商品信息, 如美妆个护、食品保健可用, 100字以内'
                  autoSize={{ minRows: 5, maxRows: 7 }}
                />
              )}
            </Form.Item>
          </Card>
          <div style={{ padding: '16px 24px 0 24px' }}>
            <Form.Item {...formTailLayout}>
              <Button
                disabled={goodsDisable && otherDisable}
                onClick={this.handleSave} type='primary'
              >
                保存
              </Button>
              <Button onClick={this.handleBack} style={{ marginLeft: 16 }}>取消</Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    )
  }
}

export default FullDiscountEditPage