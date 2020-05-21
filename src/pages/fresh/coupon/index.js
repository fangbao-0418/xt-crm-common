/*
 * @Date: 2019-11-12 11:03:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-13 16:58:12
 * @FilePath: /xt-crm/src/pages/coupon/index.js
 */
import React from 'react'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'
import { view as Loader } from '../../../components/loader'

const CouponList = Loadable({
  loader: () => import('./list'),
  loading: Loader
})
const BulkIssuing = Loadable({
  loader: () => import('./list/bulk-issuing'),
  loading: Loader
})

const CouponInfo = Loadable({
  loader: () => import('./list/coupon-info'),
  loading: Loader
})

const CouponEdit = Loadable({
  loader: () => import('./list/coupon-info/edit'),
  loading: Loader
})

const CouponDetail = Loadable({
  loader: () => import('./list/coupon-detail'),
  loading: Loader
})

export default class RouteApp extends React.Component {
  render () {
    const { match } = this.props
    console.log('coupon ---1')
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={CouponList} />
        <Route path={`${match.url}/bulkissuing/:id`} component={BulkIssuing} />
        <Route path={`${match.url}/couponinfo`} component={CouponInfo} />
        <Route path={`${match.url}/couponedit`} component={CouponEdit} />
        <Route path={`${match.url}/detail/:id`} component={CouponDetail} />
      </Switch>
    )
  }
}

RouteApp.propTypes
