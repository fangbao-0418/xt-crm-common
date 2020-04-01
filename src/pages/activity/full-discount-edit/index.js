import React, { PureComponent } from 'react'
import { Card, Form, Input, DatePicker, Radio, Button, Table } from 'antd'
import DiscountModal from './components/discount-modal'
import GoodsModal from './components/goods-modal'
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
      if (!err) return

      console.log(vals)
    })
  }

  /* 返回操作 */
  handleBack = () => {
    gotoPage(`/activity/full-discount`)
  }

  /* 添加优惠条件操作-显示优惠模态框 */
  handleDiscount = () => {
    const { dispatch } = this.props
    dispatch[namespace].saveDefault({
      discountModal: {
        visible: true,
        title: '添加优惠条件'
      }
    })
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

  render() {
    const { getFieldDecorator } = this.props.form
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
              {getFieldDecorator('promotionType')(
                <Radio.Group>
                  <Radio value={11}>满减</Radio>
                  <Radio value={12}>满折</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="优惠类型">
              {getFieldDecorator('promotionCategory')(
                <Radio.Group>
                  <Radio value={11}>阶梯满</Radio>
                  <Radio value={12}>每满减</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="优惠条件">
              <p>
                <Button onClick={this.handleDiscount} type="link">
                  添加条件
                </Button>
                <span>可添加最多X个阶梯</span>
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
                  style={{ maxWidth: 1050 }}
                  placeholder="显示在用户端, 建议填写活动商品信息, 如美妆个护、食品保健可用, 100字以内"
                  autoSize={{ minRows: 3, maxRows: 7 }}
                />
              )}
            </Form.Item>
          </Card>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button onClick={this.handleSave} type="primary">保存</Button>
            <Button style={{ marginLeft: 16 }}>取消</Button>
            <Button onClick={this.handleBack} style={{ marginLeft: 16 }}>返回</Button>
          </div>
        </Form>
      </Card>
    )
  }
}

export default FullDiscountEditPage