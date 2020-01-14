import React from 'react';
import { Route, Switch } from 'react-router-dom';
import List from './list';
import Cdkey from './cdkey';
import Detail from './detail';
import Intercept from './intercept';
import InterceptUserDetail from './intercept/detail';
import Locked from './locked'

export default class RouteApp extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/user/userlist" component={List} />
        <Route path="/user/detail" component={Detail} />
        <Route path="/user/cdkey" component={Cdkey} />
        <Route path="/user/intercept" exact={true} component={Intercept} />
        <Route path="/user/intercept/detail" component={InterceptUserDetail} />
        <Route path='/user/locked/list' component={Locked} />
      </Switch>
    );
  }
}
