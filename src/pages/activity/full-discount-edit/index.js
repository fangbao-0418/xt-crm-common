import React, { PureComponent } from 'react'
import { Card, Form, Input, DatePicker, Radio, Button, Table, InputNumber } from 'antd'
import DiscountModal from './components/discount-modal'
import GoodsModal from './components/goods-modal'
import RulesTable from './components/rules-table'
import { gotoPage, connect } from '@/util/utils';
import { namespace } from './model';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

@connect(state => ({
  discountModal: state[namespace].discountModal
}))
@Form.create()
class FullDiscountEditPage extends PureComponent {
  /* 保存操作 */
  handleSave = () => {
    this.props.form.validateFields((err, vals) => {
      console.log(err)
      if (err) return

      console.log(vals)
    })
  }

  /* 返回操作 */
  handleBack = () => {
    gotoPage(`/activity/full-discount`)
  }

  /* 添加活动商品操作-显示活动或商品模态框 */
  handleRelevancy = () => {
    const { dispatch } = this.props
    dispatch[namespace].saveDefault({
      goodsModal: {
        visible: true,
        title: '添加商品'
      }
    })
  }

  /* 优惠种类选项变化的时候-自动设置优惠类型为阶梯满 & 清空满减选项关联的满减封顶数值 */
  handlePromotionTypeChange = (e) => {
    const ruleType = e.target.value
    const { setFieldsValue } = this.props.form
    if (ruleType === 12) {
      setFieldsValue({
        ruleType: 1,
        maxDiscountsAmount: undefined
      })
    }
  }

  /* 优惠类型选项变化的时候-清空满减选项关联的满减封顶数值 */
  handleRuleTypeChange = (e) => {
    const ruleType = e.target.value
    const { setFieldsValue } = this.props.form
    if (ruleType === 1) {
      setFieldsValue({
        maxDiscountsAmount: undefined
      })
    }
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
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

    return (
      <Card
        bordered={false}
        title="添加活动"
        extra={<span onClick={this.handleBack} className="href">返回</span>}
      >
        {/* 优惠条件模态框 */}
        <DiscountModal />
        {/* 添加商品模态框 */}
        <GoodsModal />
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Card type="inner" title="基本信息">
            <Form.Item label="活动名称">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入活动名称',
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
                    message: '请输入活动名称',
                  },
                ],
              })(
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
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
                    message: '请输入满减封顶数'
                  }]
                })(
                  <RulesTable />
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
              {getFieldDecorator('productRef')(
                <Radio.Group>
                  <Radio value={0}>指定商品</Radio>
                  <Radio value={1}>指定活动</Radio>
                </Radio.Group>
              )}
              <p>
                <Button onClick={this.handleRelevancy} type="link">
                  添加数据
                </Button>
                <span>已添加最n个数据</span>
              </p>
              <Table
                style={{ marginTop: 8 }}
                pagination={false}
                dataSource={dataSource}
                columns={columns}
              />
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
              <Button style={{ marginLeft: 16 }}>取消</Button>
              <Button onClick={this.handleBack} style={{ marginLeft: 16 }}>返回</Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    )
  }
}

export default FullDiscountEditPage