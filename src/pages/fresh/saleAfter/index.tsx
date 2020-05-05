/*
 * @Date: 2020-03-06 10:18:13
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-06 14:37:04
 * @FilePath: /xt-crm/src/pages/fresh/goods/index.js
 */
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import loadable from '@/util/loadable'

const AfterSalesList = loadable(() => import('./list'))
const AfterSalesDetail = loadable(() => import('./detail/index'))

export default class RouteApp extends React.Component<any, any> {
  render () {
    const { match } = this.props
    return (
      <Switch>
        <Route path={`${match.url}`} exact component={AfterSalesList} />
        <Route
          path={`${match.url}/detail/:refundCode`} component={AfterSalesDetail} />
      </Switch>
    )
  }
}
