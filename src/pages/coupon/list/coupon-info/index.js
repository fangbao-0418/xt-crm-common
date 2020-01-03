import React, { useState, useEffect } from 'react';
import { message, Table, DatePicker, Checkbox, Form as AntdForm, Button, Card, Row, Col, Input, InputNumber, Radio } from 'antd';
import { formItemLayout, formLeftButtonLayout } from '@/config';
import { getCouponDetail } from '@/pages/coupon/api';
import { platformOptions, useIdentityOptions } from '../../config';
import { getCategoryList, saveCouponInfo } from '@/pages/coupon/api';
import { actColumns } from '@/components/activity-selector/config';
import { disabledDate } from '@/pages/helper';
import { ProductTreeSelect, ProductSelector, ActivitySelector } from '@/components';
import { unionArray, parseQuery } from '@/util/utils';
import * as adapter from '../../adapter';
import moment from 'moment';
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import './index.scss';
const { TextArea } = Input;
const { RangePicker } = DatePicker;

function CouponInfo({ form: { getFieldDecorator, getFieldsValue, setFieldsValue, validateFields }, history }) {
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
  const removeExcludeCurrentRow = id => {
    setExcludeProduct(excludeProduct.filter(v => v.id !== id));
  };
  const removeProductCurrentRow = id => {
    setChosenProduct(chosenProduct.filter(v => v.id !== id));
  };
  const removeActivityCurrentRow = id => {
    setActivityList(activityList.filter(v => v.id !== id));
  };
  // 使用平台 -> 选择平台
  const onChangePlatform = checkedValue => {
    const platformType = checkedValue.length === 4 ? 0 : 1;
    setFieldsValue({ platformType });
    setPlatformRestrictValues(checkedValue);
  };

  const fetchData = async () => {
    const { id } = parseQuery();
    if (id) {
      const detail = await getCouponDetail(id);
      const vals = adapter.couponDetailResponse(detail);
      setFieldsValue(vals);
    }
  };
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
            <Button type="link" onClick={() => removeExcludeCurrentRow(record.id)}>
              移除
            </Button>
          );
        } else {
          return (
            <Button type="link" onClick={() => removeProductCurrentRow(record.id)}>
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
        <Button type="link" onClick={() => removeActivityCurrentRow(record.id)}>
          移除
        </Button>
      )
    }
  ];
  // 是否显示排除商品按钮
  const hasExclude = () => {
    return getFieldsValue(['avlRange']).avlRange !== 2;
  };
  // 是否显示排除商品列表
  const hasExcludeList = () => {
    return hasExclude() && excludeProduct.length > 0;
  };
  // 是否显示选择商品按钮
  const hasChosen = () => {
    return !hasExclude();
  };
  // 是否显示选择活动列表
  const hasActivity = () => {
    return getFieldsValue(['avlRange']).avlRange === 4;
  };
  // 是否显示已选择商品列表
  const hasChosenList = () => {
    return hasChosen() && chosenProduct.length > 0;
  };
  // 是否有选择类目按钮
  const hasProductTreeSelect = () => {
    return getFieldsValue(['avlRange']).avlRange === 1;
  };
  const hasActivityList = () => {
    return hasActivity() && activityList.length > 0;
  };
  // 选择商品添加数据到已选择商品列表
  const onProductSelectorChange = (selectedRowKeys, selectedRows) => {
    setChosenProduct(unionArray(chosenProduct, selectedRows));
  };
  //选择商品添加数据到已排除商品列表
  const onExcludeProductSelectorChange = (selectedRowKeys, selectedRows) => {
    console.log('ExcludeProduct=>', unionArray(excludeProduct, selectedRows));
    setExcludeProduct(unionArray(excludeProduct, selectedRows));
  };
  // 选择活动添加数据到已选择活动列表里
  const onActivitySelectorChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, selectedRows);
    setActivityList(unionArray(activityList, selectedRows));
  };
  // 是否显示使用平台
  const showSelectPlatform = () => {
    return getFieldsValue(['platformType']).platformType === 1;
  };
  // 显示指定身份可用
  const showRecipientLimit = () => {
    return getFieldsValue(['recipientLimit']).recipientLimit === 1;
  };
  const getPlatformRestrictValues = platformType => {
    // 不限制
    if (platformType === 0) {
      return 'all';
    }
    // 选择平台
    else {
      return platformRestrictValues.join(',');
    }
  };
  const onUseIdentityChange = checkedValue => {
    console.log('checkedValue=>', checkedValue);
    setReceiveRestrictValues(checkedValue);
    setFieldsValue({ recipientLimit: checkedValue.length === 4 ? 0 : 1 });
  };
  const handleSave = () => {
    validateFields(async (err, fields) => {
      if (fields.recipientLimit === 1) {
        if (receiveRestrictValues.length === 0) {
          message.error('请选择指定身份');
          return;
        }
      }
      if (fields.avlRange === 2) {
        console.log('chosenProduct=>', chosenProduct);
        if (chosenProduct.length === 0) {
          message.error('请选择商品');
          return;
        }
      }
      if (fields.avlRange === 4) {
        console.log('activityList=>', activityList);
        if (activityList.length === 0) {
          message.error('请选择活动');
          return;
        }
      }
      if (fields.useTimeType === 1) {
        if (availableDays === '') {
          message.error('请输入领券当日起多少天内可用');
          return;
        }
      }
      if (dailyRestrictChecked) {
        if (!fields.dailyRestrict) {
          message.error('请输入每日限领多少张');
          return;
        }
      }
      if (fields.platformType === 1) {
        if (getPlatformRestrictValues(fields.platformType) == '') {
          message.error('请选择使用平台');
          return;
        }
      }
      if (!err) {
        const res = await saveCouponInfo({
          ...fields,
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
          history.goBack();
        }
      }
    });
  };

  const handleCancel = () => {
    history.goBack();
  };
  // 校验优惠券
  const validateName = (rule, value, callback) => {
    if (value && value.length > 20) {
      callback('优惠券最多20个字');
    } else {
      callback();
    }
  };
  // 校验优惠券条件
  const validateConditions = (rule, value = 0, callback) => {
    const { discountPrice } = getFieldsValue(['discountPrice']);
    if (value <= discountPrice) {
      callback('订单使用门槛设置金额必须大于优惠面值');
    } else {
      callback();
    }
  };
  // 领取时间校验
  const receiveTimeValidator = (rule, value = [], callback) => {
    if (value[0] && useTimeRange[0] && value[0] > useTimeRange[0]) {
      callback('领取起始时间必须小于等于使用起始时间');
    } else {
      callback();
    }
  };
  // 校验优惠券面值
  const validateDiscountPrice = (rule, value, callback) => {
    const { discountConditions, useSill } = getFieldsValue(['discountConditions', 'useSill']);
    if (useSill === 1) {
      if (value >= discountConditions) {
        callback('优惠面值必须小于使用门槛设置金额');
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  // 使用时间不可选
  const useTimeTypeDisabledDate = current => {
    const { receiveTime } = getFieldsValue(['receiveTime']);
    return (
      current &&
      current <
        ((receiveTime && receiveTime[0]) ||
          moment()
            .endOf('day')
            .subtract(1, 'days'))
    );
  };
  const formValue = getFieldsValue();
  console.log(formValue, 'render');
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
      <AntdForm
        {...formItemLayout}
        style={{
          marginBottom: 200
        }}
      >
        <Row>
          <Col offset={3}>
            <h2 className="form-title">基本信息</h2>
          </Col>
        </Row>
        <AntdForm.Item label="优惠券名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入优惠券名称',
                whitespace: true
              },
              {
                validator: validateName
              }
            ]
          })(<Input placeholder="例：国庆优惠券，最多20个字" />)}
        </AntdForm.Item>
        <AntdForm.Item label="适用范围">
          {getFieldDecorator('avlRange', { rules: [{ required: true, message: '请选择适用范围' }] })(
            <Radio.Group>
              <Radio className="block-radio" value={0}>
                全场通用
              </Radio>
              <Radio className="block-radio" value={1}>
                类目商品
              </Radio>
              <Radio className="block-radio" value={2}>
                指定商品{' '}
                {hasChosen() && (
                  <Button type="link" onClick={() => setProductSelectorVisible(true)}>
                    选择商品
                  </Button>
                )}
              </Radio>
              <Radio className="block-radio" value={4}>
                指定活动{' '}
                {hasActivity() && (
                  <Button type="link" onClick={() => setActivitySelectorVisible(true)}>
                    选择活动
                  </Button>
                )}
              </Radio>
            </Radio.Group>
          )}
          {hasExclude() && (
            <div>
              <Button type="link" onClick={() => setExcludeProductSelectorVisible(true)}>
                排除商品
              </Button>
            </div>
          )}
        </AntdForm.Item>
        {hasProductTreeSelect() && (
          <AntdForm.Item label="选择类目">
            {getFieldDecorator('categorys', {
              rules: [{ required: true, message: '请选择类目' }]
            })(<ProductTreeSelect treeData={treeData} />)}
          </AntdForm.Item>
        )}
        {hasExcludeList() && (
          <AntdForm.Item label="已排除商品">
            <Table pagination={false} rowKey="id" columns={getColumns('exclude')} dataSource={excludeProduct} />
          </AntdForm.Item>
        )}
        {hasChosenList() && (
          <AntdForm.Item label="已选择商品">
            <Table pagination={false} rowKey="id" columns={getColumns('product')} dataSource={chosenProduct} />
          </AntdForm.Item>
        )}
        {hasActivityList() && (
          <AntdForm.Item label="已选择活动">
            <Table pagination={false} rowKey="id" columns={activityColumns} dataSource={activityList} />
          </AntdForm.Item>
        )}
        <AntdForm.Item label="使用门槛">
          {getFieldDecorator('useSill', { initialValue: 1, rules: [{ required: true, message: '请选择使用门槛' }] })(
            <Radio.Group>
              <Radio disabled className="block-radio" value={0}>
                无门槛（暂未开放）
              </Radio>
              <AntdForm.Item>
                <Radio className="block-radio" value={1}>
                  <span>订单满</span>
                  {getFieldDecorator('discountConditions', {
                    rules: [{ validator: validateConditions }]
                  })(<InputNumber min={0.01} className="ml10 short-input" />)}
                  <span className="ml10">元</span>
                </Radio>
              </AntdForm.Item>
            </Radio.Group>
          )}
        </AntdForm.Item>
        <AntdForm.Item label="优惠内容（面值）">
          <Row type="flex">
            <Col>减</Col>
            <Col className="ml10 short-input">
              {getFieldDecorator('discountPrice', {
                rules: [
                  {
                    required: true,
                    message: '请输入优惠面值'
                  },
                  {
                    validator: validateDiscountPrice
                  }
                ]
              })(<InputNumber min={0.01} />)}
            </Col>
            <Col className="ml10">元</Col>
          </Row>
        </AntdForm.Item>
        <AntdForm.Item label="发放总量">
          <Row type="flex">
            <Col>
              {getFieldDecorator('inventory', { rules: [{ required: true, message: '请输入发放总量' }] })(
                <InputNumber placeholder="最多10000000" style={{ width: '160px' }} min={1} max={10000000} />
              )}
            </Col>
            <Col className="ml10">张</Col>
          </Row>
        </AntdForm.Item>
        <Row>
          <Col offset={3}>
            <h2 className="form-title">使用规则</h2>
          </Col>
        </Row>
        <AntdForm.Item label="领取时间">
          {getFieldDecorator('receiveTime', {
            rules: [{ required: true, message: '请选择领取时间' }, { validator: receiveTimeValidator }]
          })(
            <RangePicker
              disabledDate={disabledDate}
              showTime={{
                hideDisabledOptions: true
              }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          )}
        </AntdForm.Item>
        <AntdForm.Item label="使用时间">
          {getFieldDecorator('useTimeType', { rules: [{ required: true, message: '请选择使用时间类型' }] })(
            <Radio.Group>
              <AntdForm.Item>
                <Radio value={0}>
                  <RangePicker
                    disabledDate={useTimeTypeDisabledDate}
                    showTime={{
                      hideDisabledOptions: true
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={date => setUseTimeRange(date)}
                  />
                </Radio>
              </AntdForm.Item>
              <AntdForm.Item>
                <Radio value={1}>
                  <span>领券当日起</span>
                  <InputNumber
                    className="ml10 short-input"
                    min={0}
                    value={availableDays}
                    onChange={value => setAvailableDays(value)}
                  />
                  <span className="ml10">天内可用（设置为0时则为当日有效）</span>
                </Radio>
              </AntdForm.Item>
            </Radio.Group>
          )}
        </AntdForm.Item>
        <AntdForm.Item label="领取人限制">
          {getFieldDecorator('recipientLimit', { rules: [{ required: true, message: '请选择领取人限制' }] })(
            <Radio.Group>
              <Radio className="block-radio" value={0}>
                不限制
              </Radio>
              <Radio className="block-radio" value={3}>
                平台未下单用户
              </Radio>
              <Radio className="block-radio" value={1}>
                指定身份可用
              </Radio>
            </Radio.Group>
          )}
          {showRecipientLimit() && (
            <div>
              <Checkbox.Group
                options={useIdentityOptions}
                value={receiveRestrictValues}
                onChange={onUseIdentityChange}
              />
            </div>
          )}
        </AntdForm.Item>
        <AntdForm.Item label="每人限领次数">
          <Row type="flex">
            <Col>限领</Col>
            <Col className="ml10 short-input">
              {getFieldDecorator('restrictNum', { rules: [{ required: true, message: '请输入每人限领次数' }] })(
                <InputNumber placeholder="最多10" min={1} max={10} />
              )}
            </Col>
            <Col className="ml10">张</Col>
          </Row>
        </AntdForm.Item>
        <AntdForm.Item wrapperCol={formLeftButtonLayout}>
          <Row type="flex">
            <Checkbox checked={dailyRestrictChecked} onChange={e => setDailyRestrictChecked(e.target.checked)} />
            <Row type="flex">
              <Col className="ml10">每日限领</Col>
              <Col className="ml10 short-input">
                {getFieldDecorator('dailyRestrict')(<InputNumber placeholder="最多10" min={1} max={10} />)}
              </Col>
              <Col className="ml10">张</Col>
            </Row>
          </Row>
        </AntdForm.Item>
        <AntdForm.Item label="使用平台">
          {getFieldDecorator('platformType', { rules: [{ required: true, message: '请选择使用平台' }] })(
            <Radio.Group>
              <Radio className="block-radio" value={0}>
                不限制
              </Radio>
              <Radio className="block-radio" value={1}>
                选择平台
              </Radio>
            </Radio.Group>
          )}
          {showSelectPlatform() && (
            <div>
              <Checkbox.Group options={platformOptions} value={platformRestrictValues} onChange={onChangePlatform} />
            </div>
          )}
        </AntdForm.Item>
        <AntdForm.Item label="发券控制">
          {getFieldDecorator('receivePattern')(
            <Checkbox
              onChange={e => {
                console.log(e, 'eeee');
              }}
            >
              仅支持手动发券
            </Checkbox>
          )}
          <div style={{ color: '#999' }}>勾选后无法在商品详情和专题显示，只支持批量发券</div>
        </AntdForm.Item>
        {!formValue.receivePattern && (
          <AntdForm.Item label="商详显示">
            {getFieldDecorator('showFlag', { rules: [{ required: true, message: '请选择商详显示' }] })(
              <Radio.Group>
                <Radio className="block-radio" value={1}>
                  显示
                </Radio>
                <Radio className="block-radio" value={0}>
                  不显示
                </Radio>
              </Radio.Group>
            )}
          </AntdForm.Item>
        )}
        <AntdForm.Item label="优惠券说明">
          {getFieldDecorator('description', { initialValue: '' })(
            <TextArea placeholder="显示在优惠券下方，建议填写限制信息，如美妆个户、食品保健可用，仅团长专区商品可用等等（选填）" />
          )}
        </AntdForm.Item>
        <AntdForm.Item label="优惠券备注">
          {getFieldDecorator('remark', { initialValue: '' })(
            <TextArea placeholder="备注优惠券信息，不会在用户端显示（选填）" />
          )}
        </AntdForm.Item>
        {/* <FormItem
          label='优惠券备注'
        /> */}
        <AntdForm.Item wrapperCol={formLeftButtonLayout}>
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
          <Button className="ml20" onClick={handleCancel}>
            取消
          </Button>
        </AntdForm.Item>
      </AntdForm>
    </Card>
  );
}
export default AntdForm.create({ name: 'coupon-info' })(CouponInfo);
