import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Checkbox, Form, Button, Card, Row, Col, Input, InputNumber, Radio } from 'antd';
import { formItemLayout, formLeftButtonLayout } from '@/config';
import { getCategoryList, saveCouponInfo } from '@/pages/activity/api';
import { actColumns } from '@/components/activity-selector/config';
import { ProductTreeSelect, ProductSelector, ActivitySelector } from '@/components';
import { unionArray } from '@/util/utils';
import moment from 'moment';
import "./index.scss";
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

function disabledRangeTime(_, type) {
  if (type === 'start') {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  };
}
const plainOptions = [
  { label: '安卓', value: '2' },
  { label: 'iOS', value: '4' },
  { label: 'H5', value: '8' },
  { label: '小程序', value: '16' }
]
const useIdentityOptions = [
  { label: '普通用户', value: 0 },
  { label: '普通团长', value: 10 },
  { label: '星级团长', value: 12, disabled: true },
  { label: '体验团长', value: 11, disabled: true },
  { label: '社区管理员', value: 40 },
  { label: '城市合伙人', value: 30 },
]
function CouponAdd({ form: { getFieldDecorator, getFieldsValue, setFieldsValue } }) {
  const [receiveRestrictValues, setReceiveRestrictValues] = useState([])
  const [platformRestrictValues, setPlatformRestrictValues] = useState([])
  const [availableDays, setAvailableDays] = useState('');
  const [useTimeRange, setUseTimeRange] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [excludeProduct, setExcludeProduct] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [chosenProduct, setChosenProduct] = useState([]);
  const [productSelectorVisible, setProductSelectorVisible] = useState(false);
  const [activitySelectorVisible, setActivitySelectorVisible] = useState(false);
  const removeExcludeCurrentRow = (id) => {
    setExcludeProduct(excludeProduct.filter(v => v.id !== id));
  }
  const removeActivityCurrentRow = (id) => {
    setActivityList(activityList.filter(v => v.id !== id));
  }
  // 使用平台 -> 选择平台
  const onChangePlatform = (checkedValue) => {
    const platformType = checkedValue.length === 4 ? 0 : 1;
    setFieldsValue({ platformType });
    setPlatformRestrictValues(checkedValue);
    console.log('checkedValue=>', checkedValue)
  }
  useEffect(() => {
    async function getTreeData() {
      const data = await getCategoryList();
      setTreeData(data);
    }
    getTreeData();
  }, [])
  const excludeColumns = [{
    title: '商品ID',
    dataIndex: 'id',
    key: 'id'
  }, {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName'
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => <Button type="link" onClick={() => removeExcludeCurrentRow(record.id)}>移除</Button>
  }]
  const activityColumns = [...actColumns(), {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => <Button type="link" onClick={() => removeActivityCurrentRow(record.id)}>移除</Button>
  }]
  // 是否显示排除商品按钮
  const hasExclude = () => {
    return getFieldsValue(['type']).type !== 3;
  }
  // 是否显示排除商品列表
  const hasExcludeList = () => {
    return hasExclude() && excludeProduct.length > 0;
  }
  // 是否显示选择商品按钮
  const hasChosen = () => {
    return !hasExclude();
  }
  // 是否显示选择活动列表
  const hasActivity = () => {
    return getFieldsValue(['type']).type === 4;
  }
  // 是否显示已选择商品列表
  const hasChosenList = () => {
    return hasChosen() && chosenProduct.length > 0;
  }
  // 是否有选择类目
  const hasProductTreeSelect = () => {
    return getFieldsValue(['type']).type === 2;
  }
  // 选择商品添加数据到已排除商品或者已选择商品列表
  const onProductSelectorChange = (selectedRowKeys, selectedRows) => {
    if (hasExclude()) {
      setExcludeProduct(unionArray(excludeProduct, selectedRows));
    } else {
      setChosenProduct(unionArray(chosenProduct, selectedRows));
    }
  }
  // 选择活动添加数据到已选择活动列表里
  const onActivitySelectorChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, selectedRows);
    setActivityList(unionArray(activityList, selectedRows));
  }
  // 是否显示使用平台
  const showSelectPlatform = () => {
    return getFieldsValue(['platformType']).platformType === 1;
  }
  // 显示指定身份可用
  const showRecipientLimit = () => {
    return getFieldsValue(['recipientLimit']).recipientLimit === 1;
  }
  const getPlatformRestrictValues = (platformType) => {
    console.log('platformType=>', platformType);
    // 不限制
    if (platformType === 0) {
      return 'all';
    }
    // 选择平台
    else {
      return platformRestrictValues.join(',')
    }
  }
  const getReceiveRestrictValues = (recipientLimit) => {
    // 不限制
    if (recipientLimit === 0) {
      return 'all';
    } else {
      return receiveRestrictValues.join(',')
    }
  }
  const onChange = () => { }
  const onUseIdentityChange = (checkedValue) => {
    console.log('checkedValue=>', checkedValue)
    setReceiveRestrictValues(checkedValue)
    setFieldsValue({ recipientLimit: checkedValue.length === 4 ? 1 : 2 })
  }
  const getUseTimeValue = (fields) => {
    if (fields.useTimeType === 0) {
      console.log('useTimeRange=>', useTimeRange);
      return Array.isArray(useTimeRange) ? useTimeRange.map(v => v && v.valueOf()) : []
    } else {
      return availableDays;
    }
  }
  const handleSave = () => {
    const fields = getFieldsValue();
    const [startReceiveTime, overReceiveTime] = fields.receiveTime ? fields.receiveTime.map(v => v && v.valueOf()) : []
    const useTimeValue = getUseTimeValue(fields)
    const platformRestrictValues = getPlatformRestrictValues(fields.platformType);
    const receiveRestrictValues = getReceiveRestrictValues(fields.recipientLimit);
    console.log('platformRestrictValues=>', platformRestrictValues);
    Reflect.deleteProperty(fields, 'receiveTime');
    Reflect.deleteProperty(fields, 'platformType');
    console.log('fields=>', fields);
    // saveCouponInfo({
    //   name: fields.name,
    //   describe: fields.describe,
    //   remark: fields.remark,
    //   // 适用时间类型
    //   useTimeType: fields.useTimeType,
    //   // 使用时间值
    //   useTimeValue,
    //   // 开始领取时间
    //   startReceiveTime,
    //   // 结束领取时间
    //   overReceiveTime,
    //   platformRestrictValues
    // })
  }
  return (
    <Card>
      <ProductSelector visible={productSelectorVisible} onCancel={() => setProductSelectorVisible(false)} onChange={onProductSelectorChange} />
      <ActivitySelector visible={activitySelectorVisible} onCancel={() => setActivitySelectorVisible(false)} onChange={onActivitySelectorChange} />
      <Form {...formItemLayout}>
        <Row>
          <Col offset={3}>
            <h2 className="form-title">基本信息</h2>
          </Col>
        </Row>
        <Form.Item label="优惠券名称">
          {getFieldDecorator('name', { rules: [{ required: true, message: '请输入优惠券名称' }] })(<Input placeholder="例：国庆优惠券，最多20个字" />)}
        </Form.Item>
        <Form.Item label="适用范围">
          {getFieldDecorator('type', {
            initialValue: 1
          })(
            <Radio.Group>
              <Radio style={radioStyle} value={1}>全场通用</Radio>
              <Radio style={radioStyle} value={2}>类目商品</Radio>
              <Radio style={radioStyle} value={3}>指定商品 {hasChosen() && <Button type="link" onClick={() => setProductSelectorVisible(true)}>选择商品</Button>}</Radio>
              <Radio style={radioStyle} value={4}>指定活动 {hasActivity() && <Button type="link" onClick={() => setActivitySelectorVisible(true)}>选择活动</Button>}</Radio>
            </Radio.Group>
          )}
          {hasExclude() && (
            <div>
              <Button type="link" onClick={() => setProductSelectorVisible(true)}>排除商品</Button>
            </div>
          )}
        </Form.Item>
        {hasProductTreeSelect() && (
          <Form.Item label="选择类目">
            {getFieldDecorator('categorys', { rules: [{ required: true, message: '请选择类目' }] })(<ProductTreeSelect treeData={treeData} />)}
          </Form.Item>
        )}
        {hasExcludeList() && (
          <Form.Item label="已排除商品">
            <Table pagination={false} rowKey="id" columns={excludeColumns} dataSource={excludeProduct} />
          </Form.Item>
        )}
        {hasChosenList() && <Form.Item label="已选择商品">
          <Table pagination={false} rowKey="id" columns={excludeColumns} dataSource={chosenProduct} />
        </Form.Item>}
        <Form.Item label="已选择活动">
          <Table pagination={false} rowKey="id" columns={activityColumns} dataSource={activityList} />
        </Form.Item>
        <Form.Item label="使用门槛">
          {getFieldDecorator('useThreshold', { initialValue: 2, rules: [{ required: true }] })(
            <Radio.Group>
              <Radio disabled style={radioStyle} value={1}>无门槛（暂未开放）</Radio>
              <Row type="flex" align="middle">
                <Radio style={radioStyle} value={2}></Radio>
                <Row type="flex">
                  <Col>订单满</Col>
                  <Col className="ml10 short-input"><Input /></Col>
                  <Col className="ml10">元</Col>
                </Row>
              </Row>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="优惠内容（面值）">
          {getFieldDecorator('faceValue', { rules: [{ required: true }] })(
            <Row type="flex">
              <Col>减</Col>
              <Col className="ml10 short-input"><Input /></Col>
              <Col className="ml10">元</Col>
            </Row>
          )}
        </Form.Item>
        <Form.Item label="发放总量">
          {getFieldDecorator('amount', { rules: [{ required: true, message: '请输入发放总量' }] })(
            <Row type="flex">
              <Col><InputNumber /></Col>
              <Col className="ml10">张</Col>
            </Row>
          )}
          <p>修改优惠券总量时只能增加不能减少，请谨慎设置</p>
        </Form.Item>
        <Row>
          <Col offset={3}>
            <h2 className="form-title">基本信息</h2>
          </Col>
        </Row>
        <Form.Item label="领取时间">
          {getFieldDecorator('receiveTime', { rules: [{ required: true }] })(<RangePicker
            disabledDate={disabledDate}
            disabledTime={disabledRangeTime}
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
            }}
            format="YYYY-MM-DD HH:mm:ss"
          />)
          }
        </Form.Item>
        <Form.Item label="使用时间">{getFieldDecorator('useTimeType', { initialValue: 1, rules: [{ required: true }] })(
          <Radio.Group>
            <Row type="flex" align="middle">
              <Radio value={0}></Radio>
              <RangePicker
                disabledDate={disabledDate}
                disabledTime={disabledRangeTime}
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                }}
                format="YYYY-MM-DD HH:mm:ss"
                onChange={date => setUseTimeRange(date)}
              />
            </Row>
            <Row type="flex" align="middle">
              <Radio value={1}></Radio>
              <Row type="flex">
                <Col>领券当日起</Col>
                <Col className="ml10 short-input"><Input value={availableDays} onChange={event => setAvailableDays(event.target.value)} /></Col>
                <Col className="ml10">天内可用</Col>
              </Row>
            </Row>
            <p>设置为0时则为当日有效</p>
          </Radio.Group>
        )}</Form.Item>
        <Form.Item label="领取人(使用人)限制">
          {getFieldDecorator('recipientLimit')(
            <Radio.Group>
              <Radio style={radioStyle} value={0}>不限制</Radio>
              <Radio style={radioStyle} value={1}>指定身份可用</Radio>
            </Radio.Group>
          )}
          {showRecipientLimit() && <div>
            <Checkbox.Group options={useIdentityOptions} value={receiveRestrictValues} onChange={onUseIdentityChange} />
          </div>}
        </Form.Item>
        <Form.Item label="每人限领次数">
          <Row type="flex">
            <Checkbox onChange={onChange} />
            <Row type="flex">
              <Col className="ml10">限领</Col>
              <Col className="ml10 short-input">{getFieldDecorator('restrict')(<InputNumber />)}</Col>
              <Col className="ml10">张</Col>
            </Row>
          </Row>
          <Row type="flex">
            <Checkbox onChange={onChange} />
            <Row type="flex">
              <Col className="ml10">每日限领</Col>
              <Col className="ml10 short-input">{getFieldDecorator('dailyRestrict')(<InputNumber />)}</Col>
              <Col className="ml10">张</Col>
            </Row>
          </Row>
        </Form.Item>
        <Form.Item label="使用平台">
          {getFieldDecorator('platformType', { initialValue: 0, rules: [{ required: true }] })(
            <Radio.Group>
              <Radio style={radioStyle} value={0}>不限制</Radio>
              <Radio style={radioStyle} value={1}>选择平台</Radio>
            </Radio.Group>
          )}
          {showSelectPlatform() && (
            <div>
              <Checkbox.Group options={plainOptions} value={platformRestrictValues} onChange={onChangePlatform} />
            </div>
          )}
        </Form.Item>
        <Form.Item label="商详显示">
          {getFieldDecorator('showFlag', { rules: [{ required: true }] })(
            <Radio.Group>
              <Radio style={radioStyle} value={0}>显示</Radio>
              <Radio style={radioStyle} value={1}>不显示</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="优惠券说明">
          {getFieldDecorator('describe')(<TextArea placeholder="显示在优惠券下方，建议填写限制信息，如美妆个户、食品保健可用，仅团长专区商品可用等等（选填）" />)}
        </Form.Item>
        <Form.Item label="优惠券备注">
          {getFieldDecorator('remark')(<TextArea placeholder="备注优惠券信息，不会在用户端显示（选填）" />)}
        </Form.Item>
        <Form.Item wrapperCol={formLeftButtonLayout}>
          <Button type="primary" onClick={handleSave}>保存</Button>
          <Button className="ml20">取消</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
export default Form.create({ name: 'coupon-add' })(CouponAdd);