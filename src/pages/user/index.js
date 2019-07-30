import React from 'react';
import { Route, Switch } from 'react-router-dom';
import List from './list';
import Cdkey from './cdkey';
import Detail from './detail';

export default class RouteApp extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/user/userlist" component={List} />
        <Route path="/user/detail" component={Detail} />
        <Route path="/user/cdkey" component={Cdkey} />
      </Switch>
    );
  }
}
