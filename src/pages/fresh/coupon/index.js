/*
 * @Date: 2019-11-12 11:03:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-06-03 19:57:56
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/coupon/index.js
 */
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import CouponList from './list'
import BulkIssuing from './list/bulk-issuing'
import CouponInfo from './list/coupon-info'
import CouponEdit from './list/coupon-info/edit'
import CouponDetail from './list/coupon-detail'

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
