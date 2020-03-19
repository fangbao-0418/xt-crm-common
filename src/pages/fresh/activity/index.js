/*
 * @Date: 2020-03-19 14:11:00
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-19 14:49:48
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/activity/index.js
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
        <Route path={`${match.url}/info/detail/:id`} component={ActivityDetail} />
      </Switch>
    )
  }
}

export default Fresh