import React from 'react'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'
import { view as Loader } from '../../components/loader'
import Detail from './detail'
import Refund from './refund'
import RefundDetail from './refund/detail'
import AutoRefund from './auto-refund'

const Main = Loadable({
  loader: () => import('./main'),
  loading: Loader
})

export default class RouteApp extends React.Component {
  render () {
    const { match } = this.props

    return (
      <Switch>
        <Route path={`${match.url}/detail/:id`} component={Detail} />
        <Route exact path={`${match.url}/refundOrder`} component={Refund} />
        <Route exact path={`${match.url}/refundOrder/:id/:sourceType?`} component={RefundDetail} />
        <Route exact path={`${match.url}/autoRefundRule`} component={AutoRefund} />
        <Route path={`${match.url}`} component={Main} />
      </Switch>
    )
  }
}
