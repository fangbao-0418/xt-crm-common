import React from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router-dom';
import { view as Layout } from './components/layout';
import Order from './pages/order';
import Goods from './pages/goods';
import Activity from './pages/activity';
import User from './pages/user';
import Supplier from './pages/supplier';
import Banner from './pages/banner';
import Finance from './pages/finance';
import Auth from './pages/auth';
import Settings from './pages/settings';
import Home from './pages/home';
import Interface from './pages/interface';
import CrudPage from './components/crudPage';
import "./assets/styles/common.scss";
import { view as Login } from './pages/login';
import Coupon from './pages/coupon';
import Message from './pages/message';
const Main = props => {
  APP.dispatch = props.dispatch
  APP.history = props.history
  return (
    <>
      <Switch>
        <Route exact={true} path="/login" component={Login} />
        <Layout>
          <Route path="/" exact={true} render={() => <Redirect to="/home" />} />
          <Route path="/home" component={Home} />
          <Route path="/settings" component={Settings} />
          <Route path="/goods" component={Goods} />
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
        </Layout>
      </Switch>
    </>
  );
};

export default withRouter(connect()(Main));
