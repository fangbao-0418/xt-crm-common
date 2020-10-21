import React from 'react'
import RouteComponent from '@/components/route-component'
import CouponList from '../list'
import CouponDetail from '../list/coupon-detail'
import Task from './task/index'
import TaskDetail from './task/Detail'
const config = [
  { path: '', exact: true, component: CouponList },
  { path: '/detail/:id', component: CouponDetail },
  { path: '/coupon-task', exact: true, component: Task },
  { path: '/coupon-task/:id', component: TaskDetail }
]

class Main extends React.Component {
  render () {
    return (
      <RouteComponent
        config={config}
      />
    )
  }
}
export default Main
