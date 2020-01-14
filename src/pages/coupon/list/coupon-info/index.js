import React from 'react'
import { message, Table, DatePicker, Checkbox, Button, Card, Row, Col, InputNumber, Radio } from 'antd'
import { formItemLayout } from '@/config'
import { getCouponDetail } from '@/pages/coupon/api'
import { platformOptions, useIdentityOptions } from '../../config'
import { getCategoryList, saveCouponInfo } from '@/pages/coupon/api'
import { actColumns } from '@/components/activity-selector/config'
import { ProductTreeSelect, ProductSelector, ActivitySelector } from '@/components'
import { unionArray, parseQuery } from '@/util/utils'
import * as adapter from '../../adapter'
import { defaultConfig} from '../../config'
import moment from 'moment'
import { If, Form, FormItem } from '@/packages/common/components'
import './index.scss'

const formRef = {
  current: null,
  get avlRange() {
    return this.getFieldValue('avlRange')
  },
  setFieldsValue(values) {
    this.current && this.current.setValues(values)
  },
  getFieldValue(name) {
    const form = this.current
    if (form) {
      return form.props.form.getFieldValue(name)
    }
  },
  getValues() {
    return formRef.current && formRef.current.getValues()
  },
  validateFields(cb) {
    this.current && this.current.props.form.validateFields((err) => cb(err, this.getValues()))
  },
  validateConditions(rule, value = 0, callback) {
    if (value <= this.getFieldValue('discountPrice')) {
      callback('订单使用门槛设置金额必须大于优惠面值')
    } else {
      callback()
    }
  },
  // 校验优惠券面值
  validateDiscountPrice(rule, value, callback) {
    if (this.getFieldValue('useSill') === 1) {
      if (value >= this.getFieldValue('discountConditions')) {
        callback('优惠面值必须小于使用门槛设置金额')
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  // 使用时间不可选
  useTimeTypeDisabledDate(current) {
    const receiveTime = this.getFieldValue('receiveTime')
    return (
      current &&
      current <
        ((receiveTime && receiveTime[0]) ||
          moment()
            .endOf('day')
            .subtract(1, 'days'))
    )
  }
}

class CouponInfo extends React.Component {  
  constructor(props) {
    super(props)
    this.state = {
      avlRange: undefined,
      dailyRestrictChecked: false,
      receiveRestrictValues: [],
      platformRestrictValues: [],
      availableDays: '',
      useTimeRange: [],
      treeData: [],
      excludeProduct: [],
      activityList: [],
      chosenProduct: [],
      productSelectorVisible: false,
      excludeProductSelectorVisible: false,
      activitySelectorVisible: false,
      receivePattern: 0
    }
  } 

  componentDidMount() {
    this.getTreeData()
    this.fetchData()
  }

  async getTreeData() {
    const treeData = await getCategoryList()
    this.setState({ treeData })
  }
  // 使用平台 -> 选择平台
  onChangePlatform = checkedValue => {
    const platformType = checkedValue.length === 4 ? 0 : 1
    formRef.setFieldsValue({ platformType })
    this.setState({
      platformRestrictValues: checkedValue
    })
  }

  fetchData = async () => {
    const { id } = parseQuery()
    if (id) {
      const detail = await getCouponDetail(id) || {}
      const vals = adapter.couponDetailResponse(detail)
      console.log('优惠券详情=============================>', vals)
      this.setState(vals)
      formRef.setFieldsValue(vals)
    }
  }
  getColumns = type => [
    {
      title: '商品ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        if (type === 'exclude') {
          return (
            <Button
              type='link'
              onClick={() => {
                const { excludeProduct } = this.state
                this.setState({
                  excludeProduct: excludeProduct.filter(v => v.id !== record.id)
                })
              }}
            >
              移除
            </Button>
          )
        } else {
          return (
            <Button
              type='link'
              onClick={() => {
                const { chosenProduct } = this.state
                this.setState({
                  chosenProduct: chosenProduct.filter(v => v.id !== record.id)
                })
              }}>
              移除
            </Button>
          )
        }
      }
    }
  ]

  // 选择商品添加数据到已选择商品列表
  onProductSelectorChange = (selectedRowKeys, selectedRows) => {
    const { chosenProduct } = this.state
    this.setState({
      chosenProduct: unionArray(chosenProduct, selectedRows)
    })
  }
  //选择商品添加数据到已排除商品列表
  onExcludeProductSelectorChange = (selectedRowKeys, selectedRows) => {
    const { excludeProduct } = this.state
    this.setState({
      excludeProduct: unionArray(excludeProduct, selectedRows)
    })
  }
  // 选择活动添加数据到已选择活动列表里
  onActivitySelectorChange = (selectedRowKeys, selectedRows) => {
    const { activityList } = this.state
    this.setState({
      activityList: unionArray(activityList, selectedRows)
    })
  }
  getPlatformRestrictValues = (platformType) => {
    const { platformRestrictValues } = this.state
    return platformType === 0 ? 'all': platformRestrictValues.join(',')
  }
  onUseIdentityChange = (checkedValue) => {
    this.setState({
      receiveRestrictValues: checkedValue
    })
    formRef.setFieldsValue({ recipientLimit: checkedValue.length === 4 ? 0 : 1 })
  }
  handleSave = () => {
    formRef.validateFields(async (err, vals) => {
      const {
        receiveRestrictValues,
        availableDays,
        dailyRestrictChecked,
        chosenProduct,
        activityList,
        useTimeRange,
        platformRestrictValues,
        receivePattern,
        excludeProduct
      } = this.state
      if (vals.recipientLimit === 1 && receiveRestrictValues.length === 0) {
        return void message.error('请选择指定身份')
      }
      if (vals.avlRange === 2 && chosenProduct.length === 0) {
        return void message.error('请选择商品')
      }
      if (vals.avlRange === 4 && activityList.length === 0) {
        return void message.error('请选择活动')
      }
      if (vals.useTimeType === 1 && availableDays === '') {
        return void message.error('请输入领券当日起多少天内可用')
      }
      if (dailyRestrictChecked && !vals.dailyRestrict) {
        return void message.error('请输入每日限领多少张')
      }
      if (vals.platformType === 1 && this.getPlatformRestrictValues(vals.platformType) == '') {
        return void message.error('请选择使用平台')
      }
      if (!err) {
        const res = await saveCouponInfo({
          ...vals,
          dailyRestrictChecked,
          chosenProduct,
          activityList,
          useTimeRange,
          availableDays,
          platformRestrictValues,
          receiveRestrictValues,
          receivePattern,
          excludeProduct
        })
        if (res) {
          message.success('新增优惠券成功')
          APP.history.goBack()
        }
      }
    })
  }

  handleCancel = () => {
    APP.history.goBack()
  }
  // 领取时间校验
  receiveTimeValidator = (rule, value = [], callback) => {
    const { useTimeRange } = this.state
    if (useTimeRange && value[0] && useTimeRange[0] && value[0] > useTimeRange[0]) {
      callback('领取起始时间必须小于等于使用起始时间')
    } else {
      callback()
    }
  }
  render() {
    const {
      avlRange,
      productSelectorVisible,
      excludeProductSelectorVisible,
      activitySelectorVisible,
      treeData,
      excludeProduct,
      chosenProduct,
      activityList,
      availableDays,
      receiveRestrictValues,
      dailyRestrictChecked,
      platformRestrictValues,
      receivePattern,
      useTimeRange
    } = this.state
    return (
      <Card>
        {/* 已选择商品 */}
        <ProductSelector
          visible={productSelectorVisible}
          onCancel={() => this.setState({
            productSelectorVisible: false
          })}
          onChange={this.onProductSelectorChange}
        />
        {/* 排除商品 */}
        <ProductSelector
          visible={excludeProductSelectorVisible}
          onCancel={() => this.setState({
            excludeProductSelectorVisible: false
          })}
          onChange={this.onExcludeProductSelectorChange}
        />
        <ActivitySelector
          visible={activitySelectorVisible}
          onCancel={() => this.setState({
            activitySelectorVisible: false
          })}
          onChange={this.onActivitySelectorChange}
        />
        <Form
          {...formItemLayout}
          getInstance={
            ref => formRef.current = ref
          }
          config={defaultConfig}
          namespace='coupon'
          rangeMap={{
            receiveTime: {
              fields: ['startReceiveTime', 'overReceiveTime']
            }
          }}
          addonAfter={(
            <FormItem {...formItemLayout}>
              <Button type="primary" onClick={this.handleSave}>
                保存
              </Button>
              <Button className="ml20" onClick={this.handleCancel}>
                取消
              </Button>
            </FormItem>
          )}
        >
          <Row>
            <Col offset={3}>
              <h2 className='form-title'>基本信息</h2>
            </Col>
          </Row>
          <FormItem name='name' verifiable />
          <FormItem
            label='适用范围'
            required
            inner={(form) => {
              return (
                <>
                  {
                    form.getFieldDecorator('avlRange', {
                      rules: [{
                        required: true,
                        message: '请选择适用范围'
                      }]
                    })(
                      <Radio.Group
                        onChange={e => {
                          console.log('value =>', e.target.value)
                          this.setState({ avlRange: e.target.value })
                        }}
                      >
                        <Radio className='block-radio' value={0}>
                          全场通用
                        </Radio>
                        <Radio className='block-radio' value={1}>
                          类目商品
                        </Radio>
                        <Radio className='block-radio' value={2}>
                          指定商品{' '}
                          {avlRange === 2 && (
                            <Button type='link' onClick={() => {
                              this.setState({
                                productSelectorVisible: true
                              })
                            }}>
                              选择商品
                            </Button>
                          )}
                        </Radio>
                        <Radio className='block-radio' value={4}>
                          指定活动{' '}
                          {avlRange === 4 && (
                            <Button type='link' onClick={() => {
                              this.setState({
                                activitySelectorVisible: true
                              })
                            }}>
                              选择活动
                            </Button>
                          )}
                        </Radio>
                      </Radio.Group>
                    )
                  }
                  <If condition={avlRange !== 2}>
                    <div>
                      <Button type='link' onClick={() => {
                        this.setState({
                          excludeProductSelectorVisible: true
                        })
                      }}>
                        排除商品
                      </Button>
                    </div>
                  </If>
                </>
              )
            }}
          />
          <If condition={avlRange === 1}>
            <FormItem
              label='选择类目'
              required
              inner={(form) => {
                return form.getFieldDecorator('categorys', {
                  rules: [{
                    required: true,
                    message: '请选择类目'
                  }]
                })(
                  <ProductTreeSelect
                    treeData={treeData}
                  />
                )
              }}
            />
          </If>
          <If condition={avlRange !== 2 && excludeProduct.length > 0}>
            <FormItem label='已排除商品'>
              <Table
                pagination={false}
                rowKey='id'
                columns={this.getColumns('exclude')}
                dataSource={excludeProduct}
              />
            </FormItem>
          </If>
          <If condition={avlRange === 2 && chosenProduct.length > 0}>
            <FormItem label='已选择商品'>
              <Table
                pagination={false}
                rowKey='id'
                columns={this.getColumns('product')}
                dataSource={chosenProduct}
              />
            </FormItem>
          </If>
          <If condition={avlRange === 4 && activityList.length > 0}>
            <FormItem label='已选择活动'>
              <Table
                pagination={false}
                rowKey='id'
                columns={[
                  ...actColumns(),
                  {
                    title: '操作',
                    dataIndex: 'action',
                    key: 'action',
                    render: (text, record) => (
                      <Button type='link' onClick={() => {
                        const { activityList } = this.state
                        this.setState({
                          activityList: activityList.filter(v => v.id !== record.id)
                        })
                      }}>
                        移除
                      </Button>
                    )
                  }
                ]}
                dataSource={activityList}
              />
            </FormItem>
          </If>
          <FormItem
            type='radio'
            label='使用门槛'
            required
            fieldDecoratorOptions={{
              initialValue: 1,
              rules: [{
                required: true,
                message: '请选择使用门槛'
              }]
            }}
            options={[{
              label: '无门槛（暂未开放）',
              value: 0,
              disabled: true
            }]}
            inner={(form) => {
              return (
                <>
                {form.getFieldDecorator('useSill')(
                  <Radio.Group>
                    <Radio disabled className='block-radio' value={0}>
                      无门槛（暂未开放）
                    </Radio>
                    <Radio className='block-radio' value={1}>
                      <span>订单满</span>
                      {form.getFieldDecorator('discountConditions', {
                        rules: [{ validator: formRef.validateConditions.bind(formRef) }]
                      })(
                        <InputNumber
                          min={0.01}
                          className='ml10 short-input'
                        />
                      )}
                      <span className='ml10'>元</span>
                    </Radio>
                  </Radio.Group>
                )}
                </>
              )
            }}
          />
          <FormItem
            label='优惠内容（面值）'
            required
            inner={(form) => {
              return (
                <>
                  <span>减</span>
                  <span className='ml10 short-input'>
                    {form.getFieldDecorator('discountPrice', {
                      rules: [
                        {
                          required: true,
                          message: '请输入优惠面值'
                        },
                        {
                          validator: formRef.validateDiscountPrice.bind(formRef)
                        }
                      ]
                    })(
                      <InputNumber
                        min={0.01}
                      />
                    )}
                  </span>
                  <span className='ml10'>元</span>
                </>
              )
            }}
          />
          <FormItem
            label='发放总量'
            required
            inner={(form) => {
              return (
                <>
                  {form.getFieldDecorator('inventory', {
                    rules: [{
                      required: true,
                      message: '请输入发放总量'
                    }]
                  })(
                    <InputNumber
                      placeholder='最多10000000'
                      style={{ width: '160px' }}
                      min={1}
                      max={10000000}
                    />
                  )}
                  <span className='ml10'>张</span>
                </>
              )}}
          />
          <Row>
            <Col offset={3}>
              <h2 className='form-title'>使用规则</h2>
            </Col>
          </Row>
          <FormItem
            label='领取时间'
            name='receiveTime'
            type='rangepicker'
            verifiable
            fieldDecoratorOptions={{
              rules: [{
                required: true,
                message: '请选择领取时间'
              }, {
                validator: this.receiveTimeValidator
              }]
            }}
            controlProps={{
              showTime: true
            }}
          />
          <FormItem
            name='useTimeType'
            verifiable
            options={[{
              label: (
                <DatePicker.RangePicker
                  disabledDate={formRef.useTimeTypeDisabledDate.bind(formRef)}
                  showTime={{
                    hideDisabledOptions: true
                  }}
                  format='YYYY-MM-DD HH:mm:ss'
                  value={useTimeRange}
                  onChange={date => this.setState({useTimeRange: date})}
                />
              ),
              value: 0
            }, {
              label: (
                <>
                  <span>领券当日起</span>
                  <InputNumber
                    className='ml10 short-input'
                    min={0}
                    value={availableDays}
                    onChange={availableDays => this.setState({ availableDays })}
                  />
                  <span className='ml10'>天内可用（设置为0时则为当日有效）</span>
                </>
              ),
              value: 1
            }]}
          />
          <FormItem
            label='领取人限制'
            required
            inner={(form) => {
              return (
                <>
                  {form.getFieldDecorator('recipientLimit', {
                    rules: [{
                      required: true,
                      message: '请选择领取人限制'
                    }]
                  })(
                    <Radio.Group>
                      <Radio className='block-radio' value={0}>不限制</Radio>
                      <Radio className='block-radio' value={3}>平台未下单用户</Radio>
                      <Radio className='block-radio' value={1}>指定身份可用</Radio>
                    </Radio.Group>
                  )}
                  <If condition={formRef.getFieldValue('recipientLimit') === 1}>
                    <Checkbox.Group
                      options={useIdentityOptions}
                      value={receiveRestrictValues}
                      onChange={this.onUseIdentityChange}
                    />
                  </If>
                </>
              )
            }}
          />
          <FormItem
            label='每人限领次数'
            required
            inner={(form) => {
              return (
                <>
                  <span>限领</span>
                  <span className='ml10 short-input'>
                    {form.getFieldDecorator('restrictNum', {
                      rules: [{
                        required: true,
                        message: '请输入每人限领次数'
                      }]
                    })(
                      <InputNumber
                        placeholder='最多10'
                        min={1}
                        max={10}
                      />
                    )}
                  </span>
                  <span className='ml10'>张</span>
                </>
              )
            }}
          />
          <FormItem
            inner={(form) => {
              return (
                <>
                  <Checkbox
                    checked={dailyRestrictChecked}
                    onChange={e => this.setState({ dailyRestrictChecked: e.target.checked})}
                  />
                  <span className='ml10'>每日限领</span>
                  <span className='ml10 short-input'>
                    {form.getFieldDecorator('dailyRestrict')(<InputNumber placeholder='最多10' min={1} max={10} />)}
                  </span>
                  <span className='ml10'>张</span>
                </>
              )
            }}
          />
          <FormItem
            label='使用平台'
            required
            inner={form => {
              return (
                <>
                  {form.getFieldDecorator('platformType')(
                    <Radio.Group>
                      <Radio className='block-radio' value={0}>不限制</Radio>
                      <Radio className='block-radio' value={1}>选择平台</Radio>
                    </Radio.Group>
                  )}
                  <If condition={formRef.getFieldValue('platformType') === 1}>
                    <div>
                      <Checkbox.Group
                        options={platformOptions}
                        value={platformRestrictValues}
                        onChange={this.onChangePlatform}
                      />
                    </div>
                  </If>
                </>
              )
            }}
          />
          <FormItem label='发券控制'>
            <Checkbox
              checked={receivePattern}
              onChange={e => this.setState({ receivePattern: e.target.checked })}
            >
              仅支持手动发券
            </Checkbox>
            <div
              style={{ color: '#999' }}
            >
              勾选后无法在商品详情和专题显示，只支持批量发券
            </div>
          </FormItem>
          <If condition={!receivePattern}>
            <FormItem name='showFlag' verifiable/>
          </If>
          <FormItem name='description' />
          <FormItem name='remark' />
        </Form>
      </Card>
    )
  }
}
export default CouponInfo
