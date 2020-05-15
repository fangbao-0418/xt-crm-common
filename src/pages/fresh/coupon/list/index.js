/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-13 16:49:44
 * @FilePath: /xt-crm/src/pages/coupon/list/index.js
 */
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Card, Button, Input } from 'antd'
import { XtSelect, CommonTable } from '@/components'
import { getCouponlist, getCouponDetail } from '../api'
import { getListColumns } from '../config'
import receiveStatus from '@/enum/receiveStatus'
import emitter from '@/util/events'
import { defaultConfig, statusEnums } from './config'
import CouponCardModal from '../coupon-card-modal'
import { ListPage, FormItem, If, SelectFetch } from '@/packages/common/components'
import './index.scss'

function CouponList ({ form: { getFieldDecorator, getFieldsValue, resetFields }, history, match }) {
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10
  })
  const listRef = useRef(null)
  const [records, setRecords] = useState([])
  const [info, setInfo] = useState(null)
  const [visible, setVisible] = useState(false)
  const setModalVisible = async ({ visible, id }) => {
    const info = await getCouponDetail(id)
    setInfo(info)
    setVisible(visible)
  }
  useEffect(() => {
    console.log('pagination变了=>', pagination.page, pagination.pageSize)
    emitter.addListener('couponFresh.list.setVisible', setModalVisible)
    emitter.addListener('couponFresh.list.fetchData', ()=>listRef.list.refresh())
    return () => {
      emitter.removeListener('couponFresh.list.setVisible', setModalVisible)
      emitter.removeListener('couponFresh.list.fetchData', ()=>listRef.list.refresh())
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
         <ListPage
           namespace='couponFresh'
           reserveKey='couponFresh'
           formItemLayout={(
          <>
            <FormItem name='code' />
            <FormItem name='name' />
            <FormItem name='status' />
          </>
           )}
           tableProps={{
             scroll: {
               x: true
             }
           }}
           addonAfterSearch={(
             <div>
               <Button type='primary' icon='plus' onClick={handleAddCoupon}>新增优惠券</Button>
             </div>
           )}
           formConfig={defaultConfig}
           api={getCouponlist}
           getInstance={ref => listRef.list = ref}
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