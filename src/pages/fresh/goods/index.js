/*
 * @Date: 2020-03-06 10:18:13
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-01 11:14:55
 * @FilePath: /supplier/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/goods/index.js
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import loadable from '@/util/loadable'

const SkuSale = loadable(() => import('./sku-sale'))
const Check = loadable(() => import('./check'))
const Detail = loadable(() => import('./detail'))
const GoodsForm = loadable(() => import('./sku-sale/form'))
class RouteApp extends React.Component {
  render () {
    const { match } = this.props
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={SkuSale} />
        <Route path={`${match.url}/list`} component={SkuSale} />
        <Route path={`${match.url}/check`} component={Check} />
        <Route path={`${match.url}/sku-sale/:id`} component={GoodsForm} />
        <Route path={`${match.url}/detail/:id?`} component={Detail} />
      </Switch>
    )
  }
}

RouteApp.propTypes = {
  match: PropTypes.object
}
export default RouteApp
