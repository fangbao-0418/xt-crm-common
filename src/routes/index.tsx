/*
 * @Author: fangbao
 * @Date: 2020-05-19 23:06:25
 * @LastEditors: fangbao
 * @LastEditTime: 2020-06-05 17:20:39
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm-microservice/common/src/routes/index.tsx
 */

import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { view as Layout } from '@/components/layout'
import * as modules from './modules'

// Observer

interface State {
  ServerRoutes: {path: string, component: any}[]
}

class Main extends React.Component<{}, State> {
  public state: State = {
    ServerRoutes: []
  }
  public componentDidMount () {
    Observer.subscribe(() => {
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
          <Route path='/settings' component={modules.Settings} />
          <Route path='/goods' component={modules.Goods} />
          <Route path='/template' component={modules.Template} />
          <Route path='/order' component={modules.Order} />
          <Route path='/activity' component={modules.Activity} />
          <Route path='/coupon' component={modules.Coupon} />
          <Route path='/user' component={modules.User} />
          <Route path='/supplier' component={modules.Supplier} />
          <Route path='/banner' component={modules.Banner} />
          <Route path='/finance' component={modules.Finance} />
          <Route path='/auth' component={modules.Auth} />
          <Route path='/interface' component={modules.Interface} />
          <Route path='/crudpage' component={modules.CrudPage} />
          <Route path='/message' component={modules.Message} />
          <Route path='/setting' component={modules.Setting} />
          <Route path='/ulive' component={modules.ULive} />
          <Route path='/merchant-accounts' component={modules.MerchantAccounts} />
          <Route path='/shop' component={modules.Shop} />
          <Route path='/fresh' component={modules.Fresh} />
          <Route path='/system' component={modules.System} />
        </Layout>
      </Switch>
    )
  }
}

export default Main