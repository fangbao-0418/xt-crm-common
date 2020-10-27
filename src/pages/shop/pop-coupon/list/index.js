import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'
import { getCouponlist } from '../api'
import { getListColumns } from '../config'
import emitter from '@/util/events'
import { defaultConfig } from './config'
import { ListPage, FormItem } from '@/packages/common/components'
import './index.scss'

function CouponList ({ form: { getFieldDecorator, getFieldsValue, resetFields }, history, match }) {
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10
  })
  const listRef = useRef(null)
  useEffect(() => {
    console.log('pagination变了=>', pagination.page, pagination.pageSize)
    emitter.addListener('coupon.list.fetchData', () => listRef.list.refresh())
    return () => {
      emitter.removeListener('coupon.list.fetchData', () => listRef.list.refresh())
    }
  }, [pagination.page, pagination.pageSize])
  return (
    <>
      <ListPage
        namespace='coupon'
        reserveKey='coupon'
        formItemLayout={(
          <>
            <FormItem name='code' />
            <FormItem name='name' />
            <FormItem name='status' />
            <FormItem name='storeName' />
            <FormItem name='shopName' />
            <FormItem name='bizType' />
            <FormItem name='shopCode' />
          </>
        )}
        tableProps={{
          scroll: {
            x: true
          }
        }}
        getInstance={ref => listRef.list = ref}
        formConfig={defaultConfig}
        api={getCouponlist}
        columns={getListColumns()}
      />
    </>
  )
}

CouponList.propTypes = {
  form: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object

}
export default Form.create()(CouponList)