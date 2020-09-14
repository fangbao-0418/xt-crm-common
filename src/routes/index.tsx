import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { view as Layout } from '@/components/layout'
import * as modules from './modules'

import { Observer } from '@xt-micro-service/bootstrap'

interface State {
  ServerRoutes: {path: string, component: any}[]
}

class Main extends React.Component<{}, State> {
  public state: State = {
    ServerRoutes: Observer.getRoutes()
  }
  public componentWillMount () {
    Observer.onRoutePushed(() => {
      const routes = Observer.getRoutes()
      this.setState({
        ServerRoutes: routes
      })
    })
  }
  render () {
    const { ServerRoutes } = this.state
    return (
      <Switch>
        <Route exact={true} path='/login' component={modules.Login} />
        <Layout>
          <Route path='/' exact={true} render={() => <Redirect to='/home' />} />
          {
            ServerRoutes.map((item, index) => {
              return (
                <Route key={`micro-server-${index}`} path={item.path} component={item.component} />
              )
            })
          }
          <Route path='/home' component={modules.Home} />
          <Route path='/download' component={modules.Download} />
          <Route path='/settings' component={modules.Settings} />
          <Route path='/goods' component={modules.Goods} />
          <Route path='/template' component={modules.Template} />
          <Route path='/order' component={modules.Order} />
          <Route path='/user' component={modules.User} />
          <Route path='/supplier' component={modules.Supplier} />
          <Route path='/banner' component={modules.Banner} />
          <Route path='/finance' component={modules.Finance} />
          <Route path='/auth' component={modules.Auth} />
          <Route path='/interface' component={modules.Interface} />
          <Route path='/crudpage' component={modules.CrudPage} />
          <Route path='/setting' component={modules.Setting} />
          <Route path='/merchant-accounts' component={modules.MerchantAccounts} />
          <Route path='/shop' component={modules.Shop} />
          <Route path='/system' component={modules.System} />
        </Layout>
      </Switch>
    )
  }
}

export default Main