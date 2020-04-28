import React from 'react'
import { Route, Switch, RouteComponentProps } from 'react-router-dom'
import Checking from './checking'
import Withdraw from './withdraw'
class Main extends React.Component<RouteComponentProps> {
  render () {
    const { match } = this.props
    console.log(match.url, 'render')
    return (
      <Switch>
        <Route path={`${match.url}/checking`} component={Checking} />
        <Route path={`${match.url}/withdraw`} component={Withdraw} />
      </Switch>
    )
  }
}

export default Main