import React from 'react'
import PropTypes from 'prop-types'
import { message, Table, DatePicker, Checkbox, Button, Card, Row, Col, InputNumber, Radio, Form as AntForm } from 'antd'
import { formItemLayout } from '@/config'
import { getCouponDetail, getCategoryList, saveCouponInfo, importShop } from '@/pages/coupon/api'
import { platformOptions, useIdentityOptions, defaultConfig } from '../../config'
import { actColumns } from '@/components/activity-selector/config'
import { ProductTreeSelect, ProductSelector, ActivitySelector } from '@/components'
import { unionArray, parseQuery } from '@/util/utils'
import * as adapter from '../../adapter'
import moment from 'moment'
import { If, Form, FormItem, Alert } from '@/packages/common/components'
import './index.scss'

const formRef = {
  current: null,
  get avlRange () {
    return this.getFieldValue('avlRange')
  },
  setFieldsValue (values) {
    this.current && this.current.setValues(values)
  },
  getFieldValue (name) {
    const form = this.current
    if (form) {
      return form.props.form.getFieldValue(name)
    }
  },
  getValues () {
    return formRef.current && formRef.current.getValues()
  },
  validateFields (cb) {
    this.current && this.current.props.form.validateFields((err) => cb(err, this.getValues()))
  },
  validateConditions (rule, value = 0, callback) {
    const useSill = this.getFieldValue('useSill')
    const discountConditions = this.getFieldValue('discountConditions')
    console.log(useSill, discountConditions, 'validateConditions')
    if (useSill === 1) {
      if (!discountConditions) {
        callback('订单使用门槛设置金额必填')
      }
      if (discountConditions <= this.getFieldValue('discountPrice')) {
        callback('订单使用门槛设置金额必须大于优惠面值')
      }
    }
    callback()
  },
  // 校验优惠券面值
  validateDiscountPrice (rule, value, callback) {
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
  useTimeTypeDisabledDate (current) {
    const receiveTime = this.getFieldValue('receiveTime')
    return (
      current && current < ((receiveTime && receiveTime[0]) || moment().endOf('day').subtract(1, 'days'))
    )
  }
}

export function DownTemplate () {
  return (
    <span
      className='href mr8'
      onClick={() => {
        APP.fn.download(require('@/assets/files/优惠券导入商品模版.xlsx'), '导入模版')
      }}
    >
      模板下载
    </span>
  )
}

class CouponInfo extends React.Component {
  constructor (props) {
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
      receivePattern: 0,
      useTimeErrorMsg: ''
    }
  }
  /** 排除商品实例对象 */
  excludeProduct = undefined
  /** 选择商品实例对象 */
  productSelector = undefined
  componentDidMount () {
    this.getTreeData()
    this.fetchData()
  }

  async getTreeData () {
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
      console.log(err, '------')
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
      if (vals.useTimeTYPE === 0 && this.state.useTimeErrorMsg) {
        APP.error('使用开始时间必须小于结束时间')
        return
      }
      if (dailyRestrictChecked && !vals.dailyRestrict) {
        return void message.error('请输入每日限领多少张')
      }
      if (vals.platformType === 1 && this.getPlatformRestrictValues(vals.platformType) == '') {
        return void message.error('请选择使用平台')
      }
      if (err) {
        APP.error('请检查输入项')
        return
      }
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
    })
  }

  handleCancel = () => {
    APP.history.goBack()
  }
  // 领取时间校验
  receiveTimeValidator = (rule, value = [], callback) => {
    const { useTimeRange } = this.state
    const form = formRef.current
    const { useTimeType } = form ? form.getValues() : {}
    console.log(value, useTimeRange, value[0] >= value[1], 'receiveTimeValidator')
    if (value[0] && value[1]) {
      console.log(value, value[0].unix())
      if (value[0] >= value[1]) {
        callback('领取开始时间必须小于结束时间')
      }
    } else {
      if (!value[0]) {
        callback('领取开始时间不能为空')
      }
      if (!value[1]) {
        callback('领取结束时间不能为空')
      }
    }
    if (form) {
      if (useTimeType === 1) {
        callback()
        return
      }
    }
    if (useTimeType === 0 && useTimeRange && value[0] && useTimeRange[0] && value[0] > useTimeRange[0]) {
      callback('领取开始时间必须小于等于使用开始时间')
    } else if (useTimeType === 0 && useTimeRange && value[1] && useTimeRange[1] && value[1] > useTimeRange[1]) {
      console.log(value[1] > useTimeRange[1], '----')
      callback('领取结束时间必须小于等于使用结束时间')
    }
    callback()
  }
  showExportMessage = (res) => {
    this.props.alert({
      footer: false,
      content: (
        <div style={{ lineHeight: '30px', marginBottom: 20 }}>
          成功导入 <span className='success'>{res.successNo}</span> 条&nbsp;&nbsp;&nbsp;&nbsp;
          {res.excelAddress && (
            <span
              className='href'
              onClick={() => {
                APP.fn.download(res.excelAddress, '导入失败商品清单')
              }}
            >
              查看失败商品清单
            </span>
          )}
        </div>
      )
    })
  }
  render () {
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
      <Card
        className='coupon-detail'
      >
        {/* 已选择商品 */}
        <ProductSelector
          getInstance={(ref) => this.productSelector = ref}
          visible={productSelectorVisible}
          onCancel={() => this.setState({
            productSelectorVisible: false
          })}
          onChange={this.onProductSelectorChange}
        />
        {/* 排除商品 */}
        <ProductSelector
          getInstance={(ref) => this.excludeProduct = ref}
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
          onChange={(field) => {
            const form = formRef.current
            if (form && field === 'receiveTime') {
              console.log('on change')
              form.props.form.validateFields(['receiveTime'], {force: true})
            }
          }}
          config={defaultConfig}
          namespace='coupon'
          rangeMap={{
            receiveTime: {
              fields: ['startReceiveTime', 'overReceiveTime']
            }
          }}
          addonAfter={(
            <FormItem {...formItemLayout}>
              <Button type='primary' onClick={this.handleSave}>
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
                            <>
                              <span
                                className='href mr8'
                                onClick={() => {
                                  this.setState({
                                    productSelectorVisible: true
                                  })
                                  const keys = (chosenProduct || []).map((item) => item.id)
                                  this.productSelector.setState({
                                    selectedRowKeys: keys
                                  })
                                }}
                              >
                                选择商品
                              </span>
                              <span
                                className='href mr8'
                                onClick={() => {
                                  importShop().then((res) => {
                                    const data = (res.data || []).map((val) => {
                                      val.name = val.productName
                                      return val
                                    })
                                    let num = chosenProduct.length
                                    const arr = unionArray(chosenProduct, data)
                                    num = arr.length - num
                                    this.showExportMessage({
                                      successNo: num,
                                      excelAddress: res.excelAddress
                                    })
                                    this.setState({
                                      chosenProduct: arr
                                    })
                                  })
                                }}
                              >
                                导入商品
                              </span>
                              <DownTemplate />
                            </>
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
                      <span
                        className='href mr8'
                        onClick={() => {
                          this.setState({
                            excludeProductSelectorVisible: true
                          })
                          const keys = (this.state.excludeProduct || []).map((item) => item.id)
                          this.excludeProduct.setState({
                            selectedRowKeys: keys
                          })
                        }}
                      >
                        排除商品
                      </span>
                      <span
                        className='href mr8'
                        onClick={() => {
                          importShop().then((res) => {
                            const data = (res.data || []).map((val) => {
                              val.name = val.productName
                              return val
                            })
                            let num = excludeProduct.length
                            const arr = unionArray(excludeProduct, data)
                            num = arr.length - num
                            this.showExportMessage({
                              successNo: num,
                              excelAddress: res.excelAddress
                            })
                            this.setState({
                              excludeProduct: arr
                            })
                          })
                        }}
                      >
                        导入排除商品
                      </span>
                      <DownTemplate />
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
                pagination={{
                  pageSize: 5
                }}
                rowKey='id'
                columns={this.getColumns('exclude')}
                dataSource={excludeProduct}
              />
            </FormItem>
          </If>
          <If condition={avlRange === 2 && chosenProduct.length > 0}>
            <FormItem label='已选择商品'>
              <Table
                pagination={{
                  pageSize: 5
                }}
                rowKey='id'
                columns={this.getColumns('product')}
                dataSource={chosenProduct}
              />
            </FormItem>
          </If>
          <If condition={avlRange === 4 && activityList.length > 0}>
            <FormItem label='已选择活动'>
              <Table
                pagination={{
                  pageSize: 5
                }}
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
            inner={(form) => {
              return (
                <>
                  {form.getFieldDecorator('useSill', {
                    initialValue: 1,
                    rules: [
                      { required: true, message: '使用门槛必选' },
                      { validator: formRef.validateConditions.bind(formRef) }
                    ]
                  })(
                    <Radio.Group>
                      <Radio disabled className='block-radio' value={0}>
                        无门槛（暂未开放）
                      </Radio>
                      <Radio className='block-radio' value={1}>
                        <span>订单满</span>
                        {form.getFieldDecorator('discountConditions', {
                          onChange: (e) => {
                            console.log(e, 'onchange')
                            const { useSill } = form.getFieldsValue()
                            if (useSill === 1 && !e) {
                              form.setFields({
                                useSill: {
                                  value: 1,
                                  errors: [new Error('订单使用门槛设置金额必填')]
                                }
                              })
                            } else {
                              form.setFields({
                                useSill: {
                                  value: useSill
                                }
                              })
                            }
                          }
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
                validator: this.receiveTimeValidator
              }]
            }}
            controlProps={{
              showTime: true
            }}
          />
          <FormItem
            name='useTimeType'
            className='coupon-detail-use-time'
            verifiable
            controlProps={{
              onChange: (e) => {
                const value = e.target.value
                const form =  formRef.current
                if (value === 1) {
                  if (!form) {
                    return
                  }
                  const { startReceiveTime, overReceiveTime } = form.getValues()
                  form.setValues({
                    startReceiveTime,
                    overReceiveTime
                  })
                  this.setState({
                    useTimeErrorMsg: ''
                  })
                } else {
                  const { useTimeRange } = this.state
                  if (useTimeRange[0] && useTimeRange[1]) {
                    this.setState({
                      useTimeErrorMsg: useTimeRange[0] >= useTimeRange[1] ? '使用开始时间必须小于结束时间' : ''
                    })
                  }
                }
              }
            }}
            options={[{
              label: (
                <AntForm.Item
                  className='use-time-widget'
                  style={{
                    display: 'inline-bock',
                    // marginBottom: 0
                  }}
                  validateStatus={this.state.useTimeErrorMsg && 'error'}
                  help={this.state.useTimeErrorMsg}
                >
                  <DatePicker.RangePicker
                    style={{width: 400}}
                    // disabledDate={formRef.useTimeTypeDisabledDate.bind(formRef)}
                    showTime={{
                      hideDisabledOptions: true
                    }}
                    format='YYYY-MM-DD HH:mm:ss'
                    value={useTimeRange}
                    onChange={date => {
                      if (date[0] && date[1]) {
                        const form =  formRef.current
                        const useTimeType = form && form.getValues()['useTimeType']
                        const msg1 = date[0] >= date[1] ? '使用开始时间必须小于结束时间' : ''
                        const msg2 = date[1] < moment() ? '使用结束时间必须大于当前时间' : ''
                        this.setState({
                          useTimeErrorMsg: useTimeType === 0 && (msg1 || msg2)
                        })
                      } else {
                        this.setState({
                          useTimeErrorMsg: ''
                        })
                      }
                      this.setState({useTimeRange: date}, () => {
                        const form =  formRef.current
                        if (form) {
                          form.props.form.validateFields(['receiveTime'], {force: true})
                        }
                      })
                    }}
                  />
                </AntForm.Item>
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
                  {form.getFieldDecorator('platformType', {
                    rules: [{required: true, message: '请选择使用平台'}]
                  })(
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
            <FormItem name='showFlag' verifiable />
          </If>
          <FormItem name='description' />
          <FormItem name='remark' />
        </Form>
      </Card>
    )
  }
}

CouponInfo.propTypes = {
  alert: PropTypes.func
}

export default Alert(CouponInfo)
