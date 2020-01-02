import React from 'react'
import { withRouter } from 'react-router'
import { Route, Redirect, Switch } from 'react-router-dom'
import { view as Layout } from './components/layout'
import { view as Login } from './pages/login'
import Loadable from './util/loadable'
import { connect } from 'react-redux'

const { get } = APP.http
const Home = Loadable(() => import('./pages/home'))
const Settings = Loadable(() => import('./pages/settings'))
const Goods = Loadable(() => import('./pages/goods'))
const Template = Loadable(() => import('./pages/template'))
const Order = Loadable(() => import('./pages/order'))
const Activity = Loadable(() => import('./pages/activity'))
const Coupon = Loadable(() => import('./pages/coupon'))
const User = Loadable(() => import('./pages/user'))
const Supplier = Loadable(() => import('./pages/supplier'))
const Banner = Loadable(() => import('./pages/banner'))
const Finance = Loadable(() => import('./pages/finance'))
const Auth = Loadable(() => import('./pages/auth'))
const Interface = Loadable(() => import('./pages/interface'))
const CrudPage = Loadable(() => import('./components/crudPage'))
const Message = Loadable(() => import('./pages/message'))
const Setting = Loadable(() => import('./pages/setting'))

class Main extends React.Component {
  constructor (props) {
    super(props)
    APP.dispatch = props.dispatch
    APP.history = props.history
    this.fetchConfig()
  }
  async fetchConfig () {
    const list = await get('/express/getList') || []
    const expressList = list.map(item => ({
      label: item.expressCompanyName,
      value: item.expressCompanyCode
    }))
    APP.constant.expressList = expressList
    APP.constant.expressConfig = this.convert2Config(expressList)
  }
  convert2Config (list) {
    return list.reduce((config, curr) => {
      config[curr.value] = curr.label
      return config
    }, {})
  }
  render () {
    return (
      <Switch>
        <Route exact={true} path="/login" component={Login} />
        <Layout>
          <Route path="/" exact={true} render={() => <Redirect to="/home" />} />
          <Route path="/home" component={Home} />
          <Route path="/settings" component={Settings} />
          <Route path="/goods" component={Goods} />
          <Route path="/template" component={Template} />
          <Route path="/order" component={Order} />
          <Route path="/activity" component={Activity} />
          <Route path="/coupon" component={Coupon} />
          <Route path="/user" component={User} />
          <Route path="/supplier" component={Supplier} />
          <Route path="/banner" component={Banner} />
          <Route path="/finance" component={Finance} />
          <Route path="/auth" component={Auth} />
          <Route path="/interface" component={Interface} />
          <Route path="/crudpage" component={CrudPage} />
          <Route path="/message" component={Message} />
          <Route path="/setting" component={Setting}/>
        </Layout>
      </Switch>
    )
  }
}

export default withRouter(connect()(Main))
