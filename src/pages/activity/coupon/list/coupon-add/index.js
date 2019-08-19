import React, { useState } from 'react';
import { DatePicker, Checkbox, Form, Button, Card, Row, Col, Input, Radio } from 'antd';
import { formItemLayout, formButtonLayout } from '@/config';
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
const onChange = () => {

}
const plainOptions = ['安卓', 'iOS', 'H5', '小程序'];
function CouponAdd({ form: { getFieldDecorator, getFieldsValue } }) {
  const showSelectPlatform = () => {
    const { platform } = getFieldsValue(['platform']);
    return platform === 2;
  }
  return (
    <Card>
      <Form {...formItemLayout}>
        <Row>
          <Col offset={3}>
            <h2 className="form-title">基本信息</h2>
          </Col>
        </Row>
        <Form.Item label="优惠券名称">
          {getFieldDecorator('name')(<Input placeholder="例：国庆优惠券，最多20个字" />)}
        </Form.Item>
        <Form.Item label="适用范围">
          {getFieldDecorator('type')(
            <Radio.Group>
              <Radio style={radioStyle} value={1}>全场通用</Radio>
              <Radio style={radioStyle} value={2}>分类商品</Radio>
              <Radio style={radioStyle} value={3}>指定商品</Radio>
              <Radio style={radioStyle} value={4}>指定活动</Radio>
            </Radio.Group>
          )}
          <div>
            <Button type="link">排除商品</Button>
          </div>
        </Form.Item>
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
        <Form.Item {...formButtonLayout}>
          <Button type="primary">保存</Button>
          <Button>取消</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
export default Form.create({ name: 'coupon-add' })(CouponAdd);