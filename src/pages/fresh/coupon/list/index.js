/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-13 16:49:44
 * @FilePath: /xt-crm/src/pages/coupon/list/index.js
 */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Card, Button, Input } from 'antd'
import { XtSelect, CommonTable } from '@/components'
import { getCouponlist, getCouponDetail } from '../api'
import { getListColumns } from '../config'
import receiveStatus from '@/enum/receiveStatus'
import emitter from '@/util/events'
import CouponCardModal from '../coupon-card-modal'
import './index.scss'

function CouponList ({ form: { getFieldDecorator, getFieldsValue, resetFields }, history, match }) {
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10
  })
  const [records, setRecords] = useState([])
  const [info, setInfo] = useState(null)
  const [visible, setVisible] = useState(false)
  const fetchData = async () => {
    const data = getFieldsValue()
    const res = await getCouponlist({
      ...pagination,
      ...data
    }) || {}
    setRecords(res.records || [])
    setPagination({
      ...pagination,
      page: res.current,
      total: res.total
    })
  }
  const setModalVisible = async ({ visible, id }) => {
    const info = await getCouponDetail(id)
    setInfo(info)
    setVisible(visible)
  }
  useEffect(() => {
    console.log('pagination变了=>', pagination.page, pagination.pageSize)
    fetchData()
    emitter.addListener('coupon.list.setVisible', setModalVisible)
    emitter.addListener('coupon.list.fetchData', fetchData)
    return () => {
      emitter.removeListener('coupon.list.setVisible', setModalVisible)
      emitter.removeListener('coupon.list.fetchData', fetchData)
    }
  }, [pagination.page, pagination.pageSize])
  const handleAddCoupon = () => {
    history.push({
      pathname: `${match.url}/couponinfo`,
      search: 'type=add'
    })
  }
  return (
    <>
      {info && <CouponCardModal info={info} visible={visible} setVisible={setVisible} />}
      <Card>
        <Form layout='inline'>
          <Form.Item label='优惠券编号'>
            {getFieldDecorator('code', {})(<Input placeholder='请输入' />)}
          </Form.Item>
          <Form.Item label='优惠券名称'>
            {getFieldDecorator('name', {})(<Input placeholder='请输入' />)}
          </Form.Item>
          <Form.Item label='状态'>
            {getFieldDecorator('status', {})(<XtSelect data={receiveStatus.getArray('all')} style={{ width: '174px' }} placeholder='请输入' />)}
          </Form.Item>
          <Form.Item>
            <Button type='primary' onClick={fetchData}>查询</Button>
            <Button className='ml10' onClick={() => resetFields()}>重置</Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Row type='flex' justify='space-between'>
          <Button type='primary' icon='plus' onClick={handleAddCoupon}>新增优惠券</Button>
        </Row>
        <CommonTable
          onChange={setPagination}
          rowKey='id'
          current={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          className='mt15'
          columns={getListColumns()}
          dataSource={records || []}
        />
      </Card>
    </>
  )
}

CouponList.propTypes = {
  form: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object
}
export default Form.create()(CouponList)