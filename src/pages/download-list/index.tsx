import React from 'react'
import { Route, Switch, RouteComponentProps } from 'react-router-dom'
import List from './list'
class DownloadList extends React.Component<RouteComponentProps> {
  render () {
    const { match } = this.props
    return (
      <Switch>
        <Route path={`${match.url}`} component={List} exact />
      </Switch>
    )
  }
}

export default DownloadList