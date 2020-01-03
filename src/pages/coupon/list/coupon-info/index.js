import React, { useState, useEffect } from 'react';
import { message, Table, DatePicker, Checkbox, Button, Card, Row, Col, InputNumber, Radio } from 'antd';
import { formItemLayout } from '@/config';
import { getCouponDetail } from '@/pages/coupon/api';
import { platformOptions, useIdentityOptions } from '../../config';
import { getCategoryList, saveCouponInfo } from '@/pages/coupon/api';
import { actColumns } from '@/components/activity-selector/config';
import { ProductTreeSelect, ProductSelector, ActivitySelector } from '@/components';
import { unionArray, parseQuery } from '@/util/utils';
import * as adapter from '../../adapter';
import { defaultConfig} from '../../config'
import moment from 'moment';
import { If, Form, FormItem } from '@/packages/common/components'
import './index.scss';

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
  validateFields(cb) {
    this.current && this.current.props.form.validateFields(cb)
  },
  validateConditions: (rule, value = 0, callback) => {
    if (value <= this.getFieldValue('discountPrice')) {
      callback('订单使用门槛设置金额必须大于优惠面值');
    } else {
      callback();
    }
  },
  // 校验优惠券面值
  validateDiscountPrice: (rule, value, callback) => {
    if (this.getFieldValue('useSill') === 1) {
      if (value >= this.getFieldValue('discountConditions')) {
        callback('优惠面值必须小于使用门槛设置金额');
      } else {
        callback();
      }
    } else {
      callback();
    }
  },
  // 使用时间不可选
  useTimeTypeDisabledDate: (current) => {
    const receiveTime = formRef.getFieldValue('receiveTime')
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

function CouponInfo() {
  const [dailyRestrictChecked, setDailyRestrictChecked] = useState(false);
  const [receiveRestrictValues, setReceiveRestrictValues] = useState([]);
  const [platformRestrictValues, setPlatformRestrictValues] = useState([]);
  const [availableDays, setAvailableDays] = useState('');
  const [useTimeRange, setUseTimeRange] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [excludeProduct, setExcludeProduct] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [chosenProduct, setChosenProduct] = useState([]);
  const [productSelectorVisible, setProductSelectorVisible] = useState(false);
  const [excludeProductSelectorVisible, setExcludeProductSelectorVisible] = useState(false);
  const [activitySelectorVisible, setActivitySelectorVisible] = useState(false);

  // 使用平台 -> 选择平台
  const onChangePlatform = checkedValue => {
    const platformType = checkedValue.length === 4 ? 0 : 1;
    formRef.setFieldsValue({ platformType });
    setPlatformRestrictValues(checkedValue);
  }

  const fetchData = async () => {
    const { id } = parseQuery();
    if (id) {
      const detail = await getCouponDetail(id);
      const vals = adapter.couponDetailResponse(detail);
      formRef.setFieldsValue(vals);
    }
  }
  useEffect(() => {
    async function getTreeData() {
      const data = await getCategoryList();
      setTreeData(data);
    }
    getTreeData();
    fetchData();
  }, []);
  const getColumns = type => [
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
            <Button type='link' onClick={() => setExcludeProduct(excludeProduct.filter(v => v.id !== record.id))}>
              移除
            </Button>
          );
        } else {
          return (
            <Button type='link' onClick={() => setChosenProduct(chosenProduct.filter(v => v.id !== record.id))}>
              移除
            </Button>
          );
        }
      }
    }
  ];
  const activityColumns = [
    ...actColumns(),
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <Button type='link' onClick={() => setActivityList(activityList.filter(v => v.id !== record.id))}>
          移除
        </Button>
      )
    }
  ]
  // 选择商品添加数据到已选择商品列表
  const onProductSelectorChange = (selectedRowKeys, selectedRows) => {
    setChosenProduct(unionArray(chosenProduct, selectedRows));
  };
  //选择商品添加数据到已排除商品列表
  const onExcludeProductSelectorChange = (selectedRowKeys, selectedRows) => {
    setExcludeProduct(unionArray(excludeProduct, selectedRows));
  };
  // 选择活动添加数据到已选择活动列表里
  const onActivitySelectorChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, selectedRows);
    setActivityList(unionArray(activityList, selectedRows));
  };
  const getPlatformRestrictValues = platformType => platformType === 0 ? 'all': platformRestrictValues.join(',');
  const onUseIdentityChange = checkedValue => {
    setReceiveRestrictValues(checkedValue);
    formRef.setFieldsValue({ recipientLimit: checkedValue.length === 4 ? 0 : 1 });
  };
  const handleSave = () => {
    formRef.validateFields(async (err, vals) => {
      if (vals.recipientLimit === 1) {
        if (receiveRestrictValues.length === 0) {
          message.error('请选择指定身份');
          return;
        }
      }
      if (vals.avlRange === 2) {
        if (chosenProduct.length === 0) {
          message.error('请选择商品');
          return;
        }
      }
      if (vals.avlRange === 4) {
        if (activityList.length === 0) {
          message.error('请选择活动');
          return;
        }
      }
      if (vals.useTimeType === 1) {
        if (availableDays === '') {
          message.error('请输入领券当日起多少天内可用');
          return;
        }
      }
      if (dailyRestrictChecked) {
        if (!vals.dailyRestrict) {
          message.error('请输入每日限领多少张');
          return;
        }
      }
      if (vals.platformType === 1) {
        if (getPlatformRestrictValues(vals.platformType) == '') {
          message.error('请选择使用平台');
          return;
        }
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
          receiveRestrictValues
        });
        if (res) {
          message.success('新增优惠券成功');
          APP.history.goBack()
        }
      }
    });
  };

  const handleCancel = () => {
    APP.history.goBack()
  }
  // 领取时间校验
  const receiveTimeValidator = (rule, value = [], callback) => {
    if (value[0] && useTimeRange[0] && value[0] > useTimeRange[0]) {
      callback('领取起始时间必须小于等于使用起始时间');
    } else {
      callback();
    }
  }
  return (
    <Card>
      {/* 已选择商品 */}
      <ProductSelector
        visible={productSelectorVisible}
        onCancel={() => setProductSelectorVisible(false)}
        onChange={onProductSelectorChange}
      />
      {/* 排除商品 */}
      <ProductSelector
        visible={excludeProductSelectorVisible}
        onCancel={() => setExcludeProductSelectorVisible(false)}
        onChange={onExcludeProductSelectorChange}
      />
      <ActivitySelector
        visible={activitySelectorVisible}
        onCancel={() => setActivitySelectorVisible(false)}
        onChange={onActivitySelectorChange}
      />
      <Form
        {...formItemLayout}
        getInstance={
          ref => formRef.current = ref
        }
        config={defaultConfig}
        namespace='coupon'
        addonAfter={(
          <FormItem {...formItemLayout}>
            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
            <Button className="ml20" onClick={handleCancel}>
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
                    <Radio.Group>
                      <Radio className='block-radio' value={0}>
                        全场通用
                      </Radio>
                      <Radio className='block-radio' value={1}>
                        类目商品
                      </Radio>
                      <Radio className='block-radio' value={2}>
                        指定商品{' '}
                        {formRef.avlRange === 2 && (
                          <Button type='link' onClick={() => setProductSelectorVisible(true)}>
                            选择商品
                          </Button>
                        )}
                      </Radio>
                      <Radio className='block-radio' value={4}>
                        指定活动{' '}
                        {formRef.avlRange === 4 && (
                          <Button type='link' onClick={() => setActivitySelectorVisible(true)}>
                            选择活动
                          </Button>
                        )}
                      </Radio>
                    </Radio.Group>
                  )
                }
                <If condition={formRef.avlRange !== 2}>
                  <div>
                    <Button type='link' onClick={() => setExcludeProductSelectorVisible(true)}>
                      排除商品
                    </Button>
                  </div>
                </If>
              </>
            )
          }}
        />
        <If condition={formRef.avlRange === 1}>
          <FormItem
            label='选择类目'
            inner={(form) => {
              return form.getFieldDecorator('categorys', {
                rules: [{
                  required: true,
                  message: '请选择类目'
                }]
              })(
              <ProductTreeSelect
                treeData={treeData}
              />)
            }}
          />
        </If>
        <If condition={formRef.avlRange === 1}>
          <FormItem
            label='选择类目'
            inner={form => {
              return form.getFieldDecorator('categorys', {
                rules: [{ required: true, message: '请选择类目' }]
              })(
                <ProductTreeSelect treeData={treeData} />
              )
            }}
          />
        </If>
        <If condition={formRef.avlRange !== 2 && excludeProduct.length > 0}>
          <FormItem label='已排除商品'>
            <Table
              pagination={false}
              rowKey='id'
              columns={getColumns('exclude')}
              dataSource={excludeProduct}
            />
          </FormItem>
        </If>
        <If condition={formRef.avlRange === 2 && chosenProduct.length > 0}>
          <FormItem label='已选择商品'>
            <Table
              pagination={false}
              rowKey='id'
              columns={getColumns('product')}
              dataSource={chosenProduct}
            />
          </FormItem>
        </If>
        <If condition={formRef.avlRange === 4 && activityList.length > 0}>
          <FormItem label='已选择活动'>
            <Table
              pagination={false}
              rowKey='id'
              columns={activityColumns}
              dataSource={activityList}
            />
          </FormItem>
        </If>
        <FormItem
          type='radio'
          label='使用门槛'
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
                      rules: [{ validator: formRef.validateConditions }]
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
                        validator: formRef.validateDiscountPrice
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
              validator: receiveTimeValidator
            }]
          }}
        />
        <FormItem
          name='useTimeType'
          verifiable
          options={[{
            label: (
              <DatePicker.RangePicker
                disabledDate={formRef.useTimeTypeDisabledDate}
                showTime={{
                  hideDisabledOptions: true
                }}
                format='YYYY-MM-DD HH:mm:ss'
                onChange={date => setUseTimeRange(date)}
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
                  onChange={value => setAvailableDays(value)}
                />
                <span className='ml10'>天内可用（设置为0时则为当日有效）</span>
              </>
            ),
            value: 1
          }]}
        />
        <FormItem
          verifiable
          name='recipientLimit'
          addonAfter={(
            <If condition={formRef.getFieldValue('recipientLimit') === 1}>
              <Checkbox.Group
                options={useIdentityOptions}
                value={receiveRestrictValues}
                onChange={onUseIdentityChange}
              />
            </If>
          )}
        />
        <FormItem
          label='每人限领次数'
          required
          inner={(form) => {
            return (
              <>
                <Row type='flex'>
                  <Col>限领</Col>
                  <Col className='ml10 short-input'>
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
                  </Col>
                  <Col className='ml10'>张</Col>
                </Row>
                <Row type='flex'>
                  <Checkbox checked={dailyRestrictChecked} onChange={e => setDailyRestrictChecked(e.target.checked)} />
                  <Row type='flex'>
                    <Col className='ml10'>每日限领</Col>
                    <Col className='ml10 short-input'>
                      {form.getFieldDecorator('dailyRestrict')(<InputNumber placeholder='最多10' min={1} max={10} />)}
                    </Col>
                    <Col className='ml10'>张</Col>
                  </Row>
                </Row>
              </>
            )
          }}
        />
        <FormItem
          name='platformType'
          verifiable
          addonAfter={(
            <If condition={formRef.getFieldValue('platformType') === 1}>
              <Checkbox.Group
                options={platformOptions}
                value={platformRestrictValues}
                onChange={onChangePlatform}
              />
            </If>
          )}
        />
        <FormItem
          label='发券控制'
          inner={form => {
            return (
              <>
                {form.getFieldDecorator('receivePattern')(
                  <Checkbox>仅支持手动发券</Checkbox>
                )}
                <div
                  style={{ color: '#999' }}
                >
                  勾选后无法在商品详情和专题显示，只支持批量发券
                </div>
              </>
            )
          }}
        />
        <If condition={!formRef.getFieldValue('receivePattern')}>
          <FormItem name='showFlag' verifiable/>
        </If>
        <FormItem name='description' />
        <FormItem name='remark' />
      </Form>
    </Card>
  );
}
export default CouponInfo
