/*
 * @Date: 2020-03-27 11:00:32
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-12 21:07:55
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/order/index.js
 */
import React from 'react'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'
import { view as Loader } from '@/components/loader'
import Detail from './detail'
import Download from './download-list'
import Main from './main'

export default class RouteApp extends React.Component {
  render () {
    const { match } = this.props
    return (
      <Switch>
        <Route path={`${match.url}/detail/:id`} component={Detail} />
        <Route path={`${match.url}/download`} component={Download} />
        <Route path={`${match.url}`} component={Main} />
      </Switch>
    )
  }
}
