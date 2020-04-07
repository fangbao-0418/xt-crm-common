import React, { PureComponent } from 'react'
import { Card, Form, Input, DatePicker, Radio, Button, InputNumber } from 'antd'
import RulesTable from './components/rules-table'
import ProductTable from './components/product-table'
import { gotoPage, connect } from '@/util/utils';
import { namespace } from './model';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const getExceptionStr = (list) => {
  if (list.length < 2) return false
  for (let i = 0, l = list.length - 1; i < l; i++) {
    let curItem = list[i]
    let nextItem = list[i + 1]
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
      if (curItem.discounts >= nextItem.discounts) {
        return `第 ${i + 2} 级的配置必须高于第 ${i + 1} 级的配置(优惠方式: 高阶梯的折x折必须大于低阶梯的折X折)`
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
@Form.create()
class FullDiscountEditPage extends PureComponent {
  componentWillUnmount() {
    const { dispatch } = this.props
    // 这里需要重置preRulesMaps 和 preProductRefMaps的值，否则下次进入该页面会保留之前的数据
    dispatch[namespace].saveDefault({
      preRulesMaps: {},
      preProductRefMaps: {}
    })
  }

  /* 保存操作 */
  handleSave = () => {
    const {
      form: {
        validateFields
      },
      dispatch
    } = this.props
    validateFields((err, {
      title, // 活动名称
      time, // 活动时间
      promotionType, // 优惠种类
      ruleType, // 优惠类型
      maxDiscountsAmount, // 满减封顶金额
      rules, // 优惠条件
      productRef, // 活动商品
      productRefInfo, // 关联活动商品
      promotionDesc // 活动说明
    }) => {
      if (err) return
      // api: http://192.168.20.21/project/278/interface/api/50540
      const params = {
        title,
        startTime: time[0].valueOf(),
        endTime: time[1].valueOf(),
        promotionType,
        productRef,
        rule: {
          ruleType
        },
        promotionDesc,
        sort: 1
      }

      if (productRef === 0) { // 指定活动
        params.refPromotionId = productRefInfo[0].id
      } else if (productRef === 1) { // 指定商品
        params.refProductIds = productRefInfo.map(item => item.id)
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
      }

      if (ruleType === 0) {
        params.rule.maxDiscountsAmount = maxDiscountsAmount * 10 * 10
      }

      dispatch[namespace].addFullDiscounts(params)
    })
  }

  /* 返回操作 */
  handleBack = () => {
    gotoPage(`/activity/full-discount`)
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
      // 选择商品 设置值为上一次选择商品有的值 那么把活动暂时储存起来
      setFieldsValue({
        productRefInfo: preProductRefMaps['0'] || []
      })
      dispatch[namespace].saveDefault({
        preProductRefMaps: {
          ...preProductRefMaps,
          '1': productRefInfo
        }
      })
    } else if (value === 1) {
      // 选择活动 设置值为上一次选择活动有的值 那么把商品暂时储存起来
      setFieldsValue({
        productRefInfo: preProductRefMaps['1'] || []
      })
      dispatch[namespace].saveDefault({
        preProductRefMaps: {
          ...preProductRefMaps,
          '0': productRefInfo
        }
      })
    }
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue } } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }

    const formTailLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    let promotionType = getFieldValue('promotionType')
    let ruleType = getFieldValue('ruleType')
    let productRef = getFieldValue('productRef')

    return (
      <Card
        bordered={false}
        title="添加活动"
        extra={<span onClick={this.handleBack} className="href">返回</span>}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Card type="inner" title="基本信息">
            <Form.Item label="活动名称">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入活动名称(限16个字符)',
                    max: 16
                  },
                ],
              })(
                <Input style={{ maxWidth: 350 }} placeholder="限16个字符" />
              )}
            </Form.Item>
            <Form.Item label="活动时间">
              {getFieldDecorator('time', {
                rules: [
                  {
                    required: true,
                    message: '请选择活动时间',
                  },
                ],
              })(
                <RangePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                />
              )}
            </Form.Item>
          </Card>
          <Card
            style={{ marginTop: 16 }}
            type="inner"
            title="优惠信息"
          >
            <Form.Item label="优惠种类">
              {getFieldDecorator('promotionType', {
                rules: [
                  {
                    required: true,
                    message: '请选择优惠种类',
                  },
                ],
              })(
                <Radio.Group onChange={this.handlePromotionTypeChange}>
                  <Radio value={11}>满减</Radio>
                  <Radio value={12}>满折</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="优惠类型">
              {getFieldDecorator('ruleType', {
                rules: [
                  {
                    required: true,
                    message: '请选择至少一项优惠类型'
                  }
                ],
              })(
                <Radio.Group onChange={this.handleRuleTypeChange}>
                  <Radio value={1}>
                    阶梯满
                  </Radio>
                  <Radio disabled={promotionType === 12} value={0}>
                    每满减
                  </Radio>
                </Radio.Group>
              )}
              <Form.Item style={{ display: 'inline-block', marginBottom: 0 }}>
                {
                  getFieldDecorator('maxDiscountsAmount', {
                    rules: [{
                      required: ruleType === 0,
                      message: '请输入满减封顶数'
                    }]
                  })(
                    <InputNumber
                      min={0.01}
                      precision={2}
                      {...(
                        /* 解决不必选的时候也会出现报错样式的bug */
                        ruleType !== 0 ? {
                          style: {
                            borderColor: '#d9d9d9'
                          }
                        } : null
                      )}
                      disabled={ruleType !== 0}
                    />
                  )
                }
                &nbsp;元封顶，0 元表示不封顶
              </Form.Item>
            </Form.Item>
            <Form.Item label="优惠条件">
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
                      if (getExceptionStr(value)) {
                        callback(getExceptionStr(value))
                      }
                      callback()
                    }
                  }],
                  initialValue: []
                })(
                  <RulesTable
                    promotionType={promotionType}
                    ruleType={ruleType}
                  />
                )
              }
            </Form.Item>
          </Card>
          <Card
            style={{ marginTop: 16 }}
            type="inner"
            title="活动商品"
          >
            <Form.Item label="活动商品">
              {getFieldDecorator('productRef', {
                rules: [{
                  required: true,
                  message: '请选择活动商品'
                }]
              })(
                <Radio.Group
                  onChange={this.handleProductRefChange}
                >
                  <Radio value={1}>指定商品</Radio>
                  <Radio value={0}>指定活动</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="选择关联">
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
                  productRef={productRef}
                />
              )}
            </Form.Item>
          </Card>
          <Card
            style={{ marginTop: 16 }}
            type="inner"
            title="活动说明"
          >
            <Form.Item label="活动说明">
              {getFieldDecorator('promotionDesc')(
                <TextArea
                  style={{ maxWidth: 350 }}
                  placeholder="显示在用户端, 建议填写活动商品信息, 如美妆个护、食品保健可用, 100字以内"
                  autoSize={{ minRows: 5, maxRows: 7 }}
                />
              )}
            </Form.Item>
          </Card>
          <div style={{ padding: '16px 24px 0 24px' }}>
            <Form.Item {...formTailLayout}>
              <Button onClick={this.handleSave} type="primary">保存</Button>
              <Button  onClick={this.handleBack} style={{ marginLeft: 16 }}>取消</Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    )
  }
}

export default FullDiscountEditPage