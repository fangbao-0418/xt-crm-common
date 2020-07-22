/*
 * @Date: 2020-03-06 10:18:13
 * @LastEditors: fangbao
 * @LastEditTime: 2020-06-03 17:14:23
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/goods/index.js
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import GoodsTimer from './timer'
import SkuSale from './sku-sale'
import Check from './check'
import Detail from './detail'
import GoodsForm from './sku-sale/form'

class RouteApp extends React.Component {
  render () {
    const { match } = this.props
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={SkuSale} />
        <Route path={`${match.url}/list`} component={SkuSale} />
        <Route path={`${match.url}/timer`} component={GoodsTimer} />
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
