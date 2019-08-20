import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Checkbox, Form, Button, Card, Row, Col, Input, Radio } from 'antd';
import { formItemLayout, formLeftButtonLayout } from '@/config';
import { getCategoryList } from '@/pages/activity/api';
import { ProductTreeSelect, ProductSelector } from '@/components';
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
const plainOptions = ['安卓', 'iOS', 'H5', '小程序'];
function CouponAdd({ form: { getFieldDecorator, getFieldsValue } }) {
  const [treeData, setTreeData] = useState([]);
  const [excludeProduct, setExcludeProduct] = useState([]);
  const [chosenProduct, setChosenProduct] = useState([]);
  const [visible, setVisible] = useState(false);
  const showSelectPlatform = () => {
    const { platform } = getFieldsValue(['platform']);
    return platform === 2;
  }
  const removeCurrentRow = (id) => {
    setExcludeProduct(excludeProduct.filter(v => v.id !== id));
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
    render: (text, record) => <Button type="link" onClick={() => removeCurrentRow(record.id)}>移除</Button>
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
  // 是否显示已选择商品列表
  const hasChosenList = () => {
    return hasChosen() && chosenProduct.length > 0;
  }
  // 选择商品添加数据到已排除商品或者已选择商品列表
  const onProductSelectorChange = (selectedRowKeys, selectedRows) => {
    if (hasExclude()) {
      setExcludeProduct(unionArray(excludeProduct, selectedRows));
    } else {
      setChosenProduct(unionArray(chosenProduct, selectedRows));
    }
  }
  const onChange = () => { }
  return (
    <Card>
      <ProductSelector visible={visible} onCancel={() => setVisible(false)} onChange={onProductSelectorChange} />
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
              <Radio style={radioStyle} value={3}>指定商品 {hasChosen() && <Button type="link" onClick={() => setVisible(true)}>选择商品</Button>}</Radio>
              <Radio style={radioStyle} value={4}>指定活动</Radio>
            </Radio.Group>
          )}
          {hasExclude() && (
            <div>
              <Button type="link" onClick={() => setVisible(true)}>排除商品</Button>
            </div>
          )}
        </Form.Item>
        {<Form.Item label="选择类目">
          <ProductTreeSelect treeData={treeData} />
        </Form.Item>}
        {hasExcludeList() && (
          <Form.Item label="已排除商品">
            <Table pagination={false} rowKey="id" columns={excludeColumns} dataSource={excludeProduct} />
          </Form.Item>
        )}
        {hasChosenList() && <Form.Item label="已选择商品">
          <Table pagination={false} rowKey="id" columns={excludeColumns} dataSource={chosenProduct} />
        </Form.Item>}
        <Form.Item label="使用门槛">
          {getFieldDecorator('useThreshold')(
            <Radio.Group>
              <Radio style={radioStyle} value={1}>无门槛</Radio>
              <Radio style={radioStyle} value={2}>订单满</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="优惠内容（面值）">
          <Row type="flex">
            <Col>减</Col>
            <Col className="ml10 short-input"><Input /></Col>
            <Col className="ml10">元</Col>
          </Row>
        </Form.Item>
        <Form.Item label="发放总量" help="修改优惠券总量时只能增加不能减少，请谨慎设置">
          <Row type="flex">
            <Col className="short-input"><Input /></Col>
            <Col className="ml10">张</Col>
          </Row>
        </Form.Item>
        <Row>
          <Col offset={3}>
            <h2 className="form-title">基本信息</h2>
          </Col>
        </Row>
        <Form.Item label="领取时间">
          {getFieldDecorator('receiveTime')(<RangePicker
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
        <Form.Item label="使用时间" help="设置为0时则为当日有效">{getFieldDecorator('effectiveTime')(
          <Radio.Group>
            <Radio value={1}>
              <RangePicker
                disabledDate={disabledDate}
                disabledTime={disabledRangeTime}
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                }}
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Radio>
            <Row type="flex" align="middle">
              <Radio value={2}>
              </Radio>
              <Row type="flex">
                <Col className="ml10">领券当日起</Col>
                <Col className="ml10 short-input"><Input /></Col>
                <Col className="ml10">天内可用</Col>
              </Row>
            </Row>
          </Radio.Group>
        )}</Form.Item>
        <Form.Item label="使用平台">
          {getFieldDecorator('platform')(
            <Radio.Group>
              <Radio style={radioStyle} value={1}>不限制</Radio>
              <Radio style={radioStyle} value={2}>选择平台</Radio>
            </Radio.Group>
          )}
          {showSelectPlatform() && <div>
            <Checkbox.Group options={plainOptions} onChange={onChange} />
          </div>}
        </Form.Item>
        <Form.Item label="每人限领次数">
          {getFieldDecorator('limitTimes')(
            <Row type="flex">
              <Checkbox onChange={onChange} />
              <Row type="flex">
                <Col className="ml10">限领</Col>
                <Col className="ml10 short-input"><Input /></Col>
                <Col className="ml10">张</Col>
              </Row>
            </Row>
          )}
          {getFieldDecorator('limitTimes')(
            <Row type="flex">
              <Checkbox onChange={onChange} />
              <Row type="flex">
                <Col className="ml10">每日限领</Col>
                <Col className="ml10 short-input"><Input /></Col>
                <Col className="ml10">张</Col>
              </Row>
            </Row>
          )}
        </Form.Item>
        <Form.Item label="使用平台">
          {getFieldDecorator('platform')(
            <Radio.Group>
              <Radio style={radioStyle} value={1}>不限制</Radio>
              <Radio style={radioStyle} value={2}>选择平台</Radio>
            </Radio.Group>
          )}
          {showSelectPlatform() && <div>
            <Checkbox.Group options={plainOptions} onChange={onChange} />
          </div>}
        </Form.Item>
        <Form.Item label="商详显示">
          {getFieldDecorator('productDetails')(
            <Radio.Group>
              <Radio style={radioStyle} value={1}>显示</Radio>
              <Radio style={radioStyle} value={2}>不显示</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="优惠券说明">
          {getFieldDecorator('discountAmount')(<TextArea placeholder="显示在优惠券下方，建议填写限制信息，如美妆个户、食品保健可用，仅团长专区商品可用等等（选填）" />)}
        </Form.Item>
        <Form.Item label="优惠券备注">
          {getFieldDecorator('remark')(<TextArea placeholder="备注优惠券信息，不会在用户端显示（选填）" />)}
        </Form.Item>
        <Form.Item wrapperCol={formLeftButtonLayout}>
          <Button type="primary">保存</Button>
          <Button className="ml20">取消</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
export default Form.create({ name: 'coupon-add' })(CouponAdd);