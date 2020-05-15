/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-09 17:15:52
 * @FilePath: /xt-crm/src/pages/auth/index.js
 */
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import MemberList from './memeber'
import Role from './role'
import Config from './config'
import Intercept from './intercept'

export default class RouteApp extends React.Component {
  render () {
    return (
      <Switch>
        <Route path='/auth/memberlist' component={MemberList} />
        <Route path='/auth/rolelist' component={Role} />
        <Route path='/auth/config' component={Config} />
        <Route path='/auth/intercept' component={Intercept} />
      </Switch>
    )
  }
}
