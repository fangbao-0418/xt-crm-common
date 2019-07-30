import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MemberList from './memeber';
import Role from './role';
import Config from './config';

export default class RouteApp extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/auth/memberlist" component={MemberList} />
        <Route path="/auth/rolelist" component={Role} />
        <Route path="/auth/config" component={Config} />
      </Switch>
    );
  }
}