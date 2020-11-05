import React from 'react'
import RouteComponent from '@/components/route-component'
import CouponList from '../list'
import CouponDetail from '../list/coupon-detail'
const config = [
  { path: '', exact: true, component: CouponList },
  { path: '/detail/:id', component: CouponDetail }
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
