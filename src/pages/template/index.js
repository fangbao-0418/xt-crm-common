import React, { Component } from 'react';
import Loadable from 'react-loadable'
import { view as Loader } from '../../components/loader';
import { Switch, Route } from 'react-router-dom';
const page = Loadable({
  loader: () => import('./page'),
  loading: Loader,
});

const Edit = Loadable({
  loader: () => import('./edit'),
  loading: Loader,
});

export default class extends Component {
  render() {
    return (
      <Switch>
        <Route path="/template/page" component={page} />
        <Route path="/template/edit/:id?" component={Edit} />
      </Switch>
    );
  }
}