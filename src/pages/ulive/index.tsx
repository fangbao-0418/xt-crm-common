import React from 'react'
import { Route, Switch, RouteComponentProps } from 'react-router-dom'
import Anchor from './anchor'
import Studio from './studio'
import Inform from './studio/Inform'
import ConfigView from './config'
import Activity from './activity/list'
import InfoEdit from './activity/info/edit'
import InfoDetail from './activity/info/detail'

class Ulive extends React.Component<RouteComponentProps> {
  render () {
    const { match } = this.props
    return (
      <Switch>
        <Route path={`${match.url}/anchor`} component={Anchor} exact />
        <Route path={`${match.url}/studio`} component={Studio} />
        <Route path={`${match.url}/Inform/:id`} component={Inform} />
        <Route path={`${match.url}/config`} component={ConfigView} />
        <Route path={`${match.url}/activity/list`} component={Activity} />
        <Route path={`${match.url}/activity/info/edit/:id`} component={InfoEdit} />
        <Route path={`${match.url}/activity/info/detail/:id/:productId/:type`} component={InfoDetail} />
      </Switch>
    )
  }
}
export default Ulive
