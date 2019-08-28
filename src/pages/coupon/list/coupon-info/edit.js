import React, { useState, useEffect } from 'react';
import { message, Form, Button, Card, Row, Col, Input, InputNumber } from 'antd';
import { formItemLayout, formLeftButtonLayout } from '@/config';
import { getCouponDetail, modifyCouponBaseInfo } from '@/pages/coupon/api';
import { ProductSelector, ActivitySelector } from '@/components';
import { unionArray } from '@/util/utils';
import { formatAvlRange, formatFaceValue, formatReceiveRestrict, formatDateRange, formatUseTime, formatPlatformRestrict } from '@/pages/helper';
import "./index.scss";
const { TextArea } = Input;

function CouponInfo({ form: { getFieldDecorator, getFieldsValue, setFieldsValue }, history }) {
  const [detail, setDetail] = useState({});
  const [excludeProduct, setExcludeProduct] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [chosenProduct, setChosenProduct] = useState([]);
  const [productSelectorVisible, setProductSelectorVisible] = useState(false);
  const [activitySelectorVisible, setActivitySelectorVisible] = useState(false);
  const { baseVO = {}, ruleVO = {} } = detail || {};

  // 获取详情
  const fetchDetail = async (id) => {
    const detail = await getCouponDetail(id);
    setDetail(detail);
  }
  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    if (type === 'edit') {
      fetchDetail(id);
    }
  }, [])

  // 是否显示排除商品按钮
  const hasExclude = () => {
    return getFieldsValue(['avlRange']).avlRange !== 2;
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
  const handleSave = async () => {
    const fields = getFieldsValue();
    const urlSearch = new URLSearchParams(history.location.search)
    const params = {
      ...fields,
      id: +urlSearch.get('id')
    };
    const res = await modifyCouponBaseInfo(params)
    if (res) {
      message.success('编辑优惠券成功');
      history.goBack();
    }
  }
  // 取消
  const handleCancel = () => {
    history.goBack();
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
          {getFieldDecorator('name', { initialValue: baseVO.name, rules: [{ required: true, message: '请输入优惠券名称' }] })(<Input placeholder="例：国庆优惠券，最多20个字" />)}
        </Form.Item>
        <Form.Item label="适用范围">{formatAvlRange(ruleVO.avlRange)}</Form.Item>
        <Form.Item label="优惠券价值">{formatFaceValue(ruleVO)}</Form.Item>
        <Form.Item label="发放总量">
          <Row type="flex">
            <Col>{getFieldDecorator('inventory', { initialValue: baseVO.inventory, rules: [{ required: true, message: '请输入发放总量' }] })(<InputNumber min={baseVO.inventory} max={10000000} />)}</Col>
            <Col className="ml10">张</Col>
          </Row>
          <p>修改优惠券总量时只能增加不能减少，请谨慎设置</p>
        </Form.Item>
        <Row>
          <Col offset={3}>
            <h2 className="form-title">使用规则</h2>
          </Col>
        </Row>
        <Form.Item label="领取时间">{formatDateRange(ruleVO)}</Form.Item>
        <Form.Item label="使用时间">{formatUseTime(ruleVO)}</Form.Item>
        <Form.Item label="领取人(使用人)限制">{formatReceiveRestrict(ruleVO.receiveRestrict)}</Form.Item>
        <Form.Item label="每人限领次数">{ruleVO.dailyRestrict}</Form.Item>
        <Form.Item label="使用平台">{formatPlatformRestrict(ruleVO.platformRestrict)}</Form.Item>
        <Form.Item label="商详显示">{ruleVO.showFlag === 0 ? '显示' : '不显示'}</Form.Item>
        <Form.Item label="优惠券说明">
          {getFieldDecorator('description', { initialValue: baseVO.description })(<TextArea placeholder="显示在优惠券下方，建议填写限制信息，如美妆个户、食品保健可用，仅团长专区商品可用等等（选填）" />)}
        </Form.Item>
        <Form.Item label="优惠券备注">
          {getFieldDecorator('remark', { initialValue: baseVO.remark })(<TextArea placeholder="备注优惠券信息，不会在用户端显示（选填）" />)}
        </Form.Item>
        <Form.Item wrapperCol={formLeftButtonLayout}>
          <Button type="primary" onClick={handleSave}>保存</Button>
          <Button className="ml20" onClick={handleCancel}>取消</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
export default Form.create({ name: 'coupon-info' })(CouponInfo);