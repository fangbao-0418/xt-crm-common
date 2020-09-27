import React, { useState, useEffect } from 'react'
import { Tabs, Form, Card, Button, Modal, Table, Message } from 'antd'
import { formLeftButtonLayout, formItemLayout } from '@/config'
import { getCouponDetail } from '@/pages/shop/pop-coupon/api'
import { withRouter } from 'react-router-dom'
import { param } from '@/packages/common/utils'
import { formatFaceValue, formatbizType, formatDateRange, formatUseTime, formatAvlRange, formatReceiveRestrict, formatPlatformRestrict } from '@/pages/helper'
import { parseQuery } from '@/util/utils'
const { TabPane } = Tabs
const { confirm } = Modal
const columns = [{
  title: 'ID',
  dataIndex: 'id',
  key: 'id',
  width: 100
}, {
  title: '名称',
  dataIndex: 'name',
  key: 'name',
  width: 200
}]

function CouponDetail ({ match, history }) {
  const query = parseQuery()
  const [data, setData] = useState({})
  const { baseVO = {}, ruleVO = {} } = data
  const fetchDetail = async () => {
    const data = await getCouponDetail(match.params.id)
    setData(data || {})
  }
  const onChange = (activeKey) => {
    APP.history.push({
      pathname: `${match.url}`,
      search: param({
        activeKey,
        code: query.code
      })
    })
  }
  useEffect(() => {
    fetchDetail()
  }, [])
  const { activeKey = '1' } = parseQuery()
  return (
    <Card>
      <Tabs onChange={onChange} activeKey={activeKey}>
        <TabPane tab='优惠详情' key='1'>
          <Form {...formItemLayout}>
            <Form.Item label='渠道'>{formatbizType(data?.bizType)}</Form.Item>
            <Form.Item label='优惠券名称'>{baseVO.name}</Form.Item>
            <Form.Item label='适用范围'>{formatAvlRange(ruleVO.avlRange)}</Form.Item>
            {ruleVO.rangeVOList && ruleVO.rangeVOList.length > 0 && (
              <Form.Item wrapperCol={formLeftButtonLayout}>
                <Table
                  style={{ width: '400px' }}
                  pagination={{
                    pageSize: 5
                  }}
                  rowKey='id'
                  columns={columns}
                  dataSource={ruleVO.rangeVOList}
                />
              </Form.Item>
            )}
            {ruleVO.excludeProductVOList && ruleVO.excludeProductVOList.length > 0 && (
              <Form.Item label='已排除商品'>
                <Table
                  style={{ width: '400px' }}
                  pagination={{
                    pageSize: 5
                  }}
                  rowKey='id'
                  columns={columns}
                  dataSource={ruleVO.excludeProductVOList}
                />
              </Form.Item>
            )}
            <Form.Item label='优惠券价值'>{formatFaceValue(ruleVO)}</Form.Item>
            <Form.Item label='发放总量'>{baseVO.inventory}张，已领取数量{baseVO.receiveCount}张</Form.Item>
            <Form.Item label='领取时间'>{formatDateRange(ruleVO)}</Form.Item>
            <Form.Item label='用券时间'>{formatUseTime(ruleVO)}</Form.Item>
            <Form.Item label='领取人限制'>{formatReceiveRestrict(ruleVO.receiveRestrict)}</Form.Item>
            <Form.Item label='每人限领次数'>{ruleVO.restrictNum}张</Form.Item>
            <Form.Item label='每日限领次数'>{ruleVO.dailyRestrict ? `${ruleVO.dailyRestrict}张` : '无'}</Form.Item>
            <Form.Item label='使用平台'>{formatPlatformRestrict(ruleVO.platformRestrict)}</Form.Item>
            {ruleVO.receivePattern === 1 && <Form.Item label='发券控制'>仅支持手动发券</Form.Item>}
            {ruleVO.receivePattern !== 1 && (<Form.Item label='商详显示'>{ruleVO.showFlag === 1 ? '显示' : '不显示'}</Form.Item>)}
            <Form.Item label='优惠券说明'>{baseVO.description || '无'}</Form.Item>
            <Form.Item label='优惠券备注'>{baseVO.remark || '无'}</Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Card>
  )
}
export default withRouter(CouponDetail)