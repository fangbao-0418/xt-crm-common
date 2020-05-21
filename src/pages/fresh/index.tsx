import React from 'react'
import { Route, Switch, RouteComponentProps } from 'react-router-dom'
import Store from './store'
import Goods from './goods'
import StoreForm from './store/form'
import StoreTimer from './store/timer'
import Order from './order'
import Category from './category'
import Activity from './activity'
import Coupon from './coupon'
import MerchantAccounts from './merchant-accounts'
import SaleAfter from './saleAfter/index'
import Setting from './setting'
<<<<<<< HEAD
import Hotkey from './hotkey'
=======
import Area from './area-management'
import AreaAdd from './area-management/form'
import Instructor from './instructor-management'
import InstructorAdd from './instructor-management/form'
>>>>>>> origin/feature/issue115
class Fresh extends React.Component<RouteComponentProps> {
  render () {
    const { match } = this.props
    return (
      <Switch>
        <Route path={`${match.url}/store`} component={Store} exact />
        <Route path={`${match.url}/goods`} component={Goods} />
        <Route path={`${match.url}/store/timer`} component={StoreTimer} />
        <Route path={`${match.url}/store/:id`} component={StoreForm} />
        <Route path={`${match.url}/order`} component={Order} />
        <Route path={`${match.url}/saleAfter`} component={SaleAfter} />
        <Route path={`${match.url}/activity`} component={Activity} />
        <Route path={`${match.url}/coupon`} component={Coupon} />
        <Route path={`${match.url}/category`} component={Category} />
        <Route path={`${match.url}/setting`} component={Setting} />
        <Route path={`${match.url}/hotkey`} component={Hotkey} />
        <Route path={`${match.url}/merchant-accounts`} component={MerchantAccounts} />
        <Route path={`${match.url}/area`} exact component={Area} />
        <Route path={`${match.url}/area/:id`} component={AreaAdd} />
        <Route path={`${match.url}/instructor`} exact component={Instructor} />
        <Route path={`${match.url}/instructor/:id`} component={InstructorAdd} />
      </Switch>
    )
  }
}

export default Fresh
