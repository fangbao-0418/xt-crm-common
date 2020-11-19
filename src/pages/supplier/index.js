/*
 * @Date: 2019-11-12 11:03:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-09 16:30:18
 * @FilePath: /xt-crm/src/pages/supplier/index.js
 */
import React from 'react'
import PropTypes from 'prop-types'
// import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom'
import List from './list'
import Detail from './detail'
// import { view as Loader } from '../../components/loader';

// const List = Loadable({
//   loader: () => import('./list'),
//   loading: Loader,
// });

class RouteApp extends React.Component {
  render () {
    const { match } = this.props
    return (
      <Switch>
        <Route path={`${match.url}/list`} component={List} exact />
        <Route path={`${match.url}/access-details`} component={Detail} exact />
      </Switch>
    )
  }
}

RouteApp.propTypes = {
  match: PropTypes.object
}

export default RouteApp