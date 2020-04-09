/*
 * @Date: 2019-11-12 11:03:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-09 16:33:05
 * @FilePath: /xt-crm/src/pages/system/index.tsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import Palamidi from './palamidi'

interface Props extends RouteComponentProps<{}> {}

class RouteApp extends React.Component<Props> {
  render () {
    const { match } = this.props
    return (
      <Switch>
        <Route path={`${match.url}/palamidi`} component={Palamidi} />
      </Switch>
    )
  }
}
export default RouteApp
