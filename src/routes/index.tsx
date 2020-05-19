/*
 * @Author: fangbao
 * @Date: 2020-05-19 23:06:25
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-19 23:17:23
 * @FilePath: /xt-crm/src/routes/index.tsx
 */

import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { view as Layout } from '@/components/layout'
import * as modules from './modules'

class Main extends React.Component {
  render () {
    return (
      <Switch>
        <Route exact={true} path='/login' component={modules.Login} />
        <Layout>
          <Route path='/' exact={true} render={() => <Redirect to='/home' />} />
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