import React from 'react'
import RouteComponent from '@/components/route-component'
import CouponList from './list'
import BulkIssuing from './list/bulk-issuing'
import CouponInfo from './list/coupon-info'
import CouponEdit from './list/coupon-info/edit'
import CouponDetail from './list/coupon-detail'
import Task from './task'
import TaskDetail from './task/Detail'

const config = [
  { path: '/', exact: true, component: CouponList },
  { path: '/get/couponList/bulkissuing/:id', component: BulkIssuing },
  { path: '/get/couponList/couponinfo', component: CouponInfo },
  { path: '/get/couponList/couponedit', component: CouponEdit },
  { path: '/get/couponList/detail/:id', component: CouponDetail },
  { path: '/task', exact: true, component: Task },
  { path: '/task/:id', component: TaskDetail }
]

export default class RouteApp extends React.Component {
  render () {
    alert(111)
    return (
      <div>111111</div>
    )
    const { match } = this.props
    return (
      <RouteComponent
        config={config}
      />
    )
  }
}

// RouteApp.propTypes
