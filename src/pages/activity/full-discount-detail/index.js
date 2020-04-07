import React, { PureComponent } from 'react'
import { Card, Form, Table } from 'antd'
import { gotoPage } from '@/util/utils';
import { detailFullDiscounts } from './api'
import { getGoodsColumns, getActivityColumns } from './config/config';

const formatDate = (text) =>
  text ? APP.fn.formatDate(text) : '-'

class FullDiscountDetailPage extends PureComponent {
  state = {
    detail: null
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props
    detailFullDiscounts(id).then(detail => {
      this.setState({
        detail
      })
    })
  }

  /* 返回操作 */
  handleBack = () => {
    gotoPage(`/activity/full-discount`)
  }

  render() {
    const { detail } = this.state

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

    let title = '加载中...'
    let time = '加载中...'
    let promotionDesc = '加载中...'
    let columns = []
    let referenceProductVO = []

    if (detail) {
      title = detail.title || '暂无数据'
      time = formatDate(detail.startTime) + ' 至 ' + formatDate(detail.endTime)
      promotionDesc = detail.promotionDesc || '暂无数据'

      if (detail.productRef === 0) { // 活动
        columns = getActivityColumns()
      } else if (detail.productRef === 1) { // 商品
        columns = getGoodsColumns()
      }

      referenceProductVO = detail.referenceProductVO
    }

    console.log(detail, referenceProductVO)

    return (
      <Card
        bordered={false}
        title="查看活动"
        extra={<span onClick={this.handleBack} className="href">返回</span>}
      >
        <Form {...formItemLayout}>
          <Card type="inner" title="基本信息">
            <Form.Item label="活动名称">{title}</Form.Item>
            <Form.Item label="活动时间">{time} </Form.Item>
          </Card>
          <Card type="inner" title="优惠信息">
            <Form.Item label="优惠种类">优惠种类</Form.Item>
            <Form.Item label="优惠类型">优惠类型</Form.Item>
            <Form.Item label="优惠条件">优惠条件</Form.Item>
          </Card>
          <Card type="inner" title="活动商品">
            <Form.Item label="指定活动">
              <Table
                style={{ margin: '8px 0 8px' }}
                pagination={false}
                dataSource={referenceProductVO}
                columns={columns}
              />
            </Form.Item>
          </Card>
          <Card type="inner" title="活动说明">
            <Form.Item label="活动说明">{promotionDesc}</Form.Item>
          </Card>
        </Form>
      </Card>
    )
  }
}

export default FullDiscountDetailPage