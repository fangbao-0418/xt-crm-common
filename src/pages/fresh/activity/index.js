/*
 * @Date: 2020-03-19 14:11:00
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-08 17:04:29
 * @FilePath: /xt-crm/src/pages/fresh/activity/index.js
 */
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ActivityList from './List'
import ActivityEdit from './info/edit'
import ActivityDetail from './info/detail'
class Fresh extends React.Component {
  render() {
    const { match } = this.props
    return (
      <Switch>
        <Route path={`${match.url}/list`} component={ActivityList} />
        <Route path={`${match.url}/info/edit/:id`} component={ActivityEdit} />
        <Route path={`${match.url}/info/detail/:id/:productId`} component={ActivityDetail} />
      </Switch>
    )
  }
}

export default Fresh