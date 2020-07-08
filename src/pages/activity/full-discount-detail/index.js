import React, { PureComponent } from 'react'
import { Card, Form, Table } from 'antd'
import { gotoPage } from '@/util/utils'
import { formatMoneyWithSign } from '@/pages/helper'
import { detailFullDiscounts } from './api'
import { getRulesColumns, getGoodsColumns, getActivityColumns } from './config/columns'
import { promotionTypeMap } from './config/config'

const formatDate = (text) =>
  text ? APP.fn.formatDate(text) : '-'

class FullDiscountDetailPage extends PureComponent {
  state = {
    detail: null
  }

  componentDidMount () {
    const { match: { params: { id } } } = this.props
    detailFullDiscounts(id).then(detail => {
      this.setState({
        detail
      })
    })
  }

  /* 返回操作 */
  handleBack = () => {
    gotoPage('/activity/full-discount')
  }

  render () {
    const { detail } = this.state

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    }

    let title = '加载中...'// 活动名称
    let time = '加载中...' // 活动时间
    let promotionType = '加载中...' // 优惠种类
    let ruleTypeTxt = '加载中...' // 优惠类型
    let rules = [] // 优惠条件
    let label = '活动商品' // 活动商品文案
    let columns = [] // 活动商品表头
    let dataSource = [] // 活动商品数据
    let promotionDesc = '加载中...' // 活动说明

    if (detail) {
      title = detail.title || '暂无数据'
      time = formatDate(detail.startTime) + ' 至 ' + formatDate(detail.endTime)
      promotionType = promotionTypeMap[detail.promotionType]
      if (detail.rule) {
        const rule = detail.rule
        // 优惠类型
        if (rule.ruleType === 0) {
          ruleTypeTxt = '每满减 & '
          if (rule.maxDiscountsAmount === 0) {
            ruleTypeTxt += '未设置最大优惠金额(不封顶)'
          } else {
            ruleTypeTxt += `最大优惠金额: ${formatMoneyWithSign(rule.maxDiscountsAmount)}`
          }
        } else if (rule.ruleType === 1) {
          ruleTypeTxt = '阶梯满'
        } else {
          ruleTypeTxt = '数据出错'
        }

        // 优惠条件
        if (detail.promotionType === 11) { // 满减
          rules = rule.amountRuleList.map(item => {
            if (detail.stageType === 1) { // 满 x 元
              return {
                ...item,
                conditionStr: `满 ${formatMoneyWithSign(item.stageAmount)} 元`,
                modeStr: `减 ${formatMoneyWithSign(item.discountsAmount)} 元`
              }
            } else if (detail.stageType === 2) { // 满 x 件
              return {
                ...item,
                conditionStr: `满 ${item.stageCount} 件`,
                modeStr: `减 ${formatMoneyWithSign(item.discountsAmount)} 元`
              }
            } else {
              return item
            }
          })
        } else if (detail.promotionType === 12) { // 满折
          rules = rule.discountsRuleList.map(item => {
            if (detail.stageType === 1) { // 满 x 元
              return {
                ...item,
                conditionStr: `满 ${formatMoneyWithSign(item.stageAmount)} 元`,
                modeStr: `打 ${item.discounts / 10} 折`
              }
            } else if (detail.stageType === 2) { // 满 x 件
              return {
                ...item,
                conditionStr: `满 ${item.stageCount} 件`,
                modeStr: `打 ${item.discounts / 10} 折`
              }
            } else {
              return item
            }
          })
        } else if (detail.promotionType === 15) { // 一口价
          rules = rule.onePriceRuleList.map(item => {
            return {
              ...item,
              conditionStr: `满 ${item.stageCount} 件`,
              modeStr: `${formatMoneyWithSign(item.amount)} 元购买`
            }
          })
        }
      } else {
        ruleTypeTxt = '未获取rule字段数据'
      }

      if (detail.productRef === 0) { // 活动
        label = '指定活动'
        columns = getActivityColumns()
      } else if (detail.productRef === 1) { // 商品
        label = '指定商品'
        columns = getGoodsColumns()
      }

      if (detail.productRef === 1) {
        dataSource = detail.referenceProductVO
      } else if (detail.productRef === 0) {
        dataSource = [detail.refPromotion]
      }
      promotionDesc = detail.promotionDesc || '暂无数据'
    }

    return (
      <Card
        bordered={false}
        title='查看活动'
        extra={<span onClick={this.handleBack} className='href'>返回</span>}
      >
        <Form {...formItemLayout}>
          <Card type='inner' title='基本信息'>
            <Form.Item label='活动名称'>{title}</Form.Item>
            <Form.Item label='活动时间'>{time} </Form.Item>
          </Card>
          <Card style={{ marginTop: 16 }} type='inner' title='优惠信息'>
            <Form.Item label='优惠种类'>{promotionType}</Form.Item>
            <Form.Item label='优惠类型'>{ruleTypeTxt}</Form.Item>
            <Form.Item label='优惠条件'>
              <Table
                style={{ margin: '8px 0 8px' }}
                pagination={false}
                dataSource={rules}
                columns={getRulesColumns()}
              />
            </Form.Item>
          </Card>
          <Card style={{ marginTop: 16 }} type='inner' title='活动商品'>
            <Form.Item label={label}>
              <Table
                pagination={false}
                dataSource={dataSource}
                columns={columns}
              />
            </Form.Item>
          </Card>
          <Card style={{ marginTop: 16 }} type='inner' title='活动说明'>
            <Form.Item label='活动说明'>{promotionDesc}</Form.Item>
          </Card>
        </Form>
      </Card>
    )
  }
}

export default FullDiscountDetailPage