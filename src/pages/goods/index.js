import React from 'react';
import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';
import { view as Loader } from '../../components/loader';
import Category from './category/index.js';

const List = Loadable({
  loader: () => import('./view'),
  loading: Loader,
});

const Edit = Loadable({
  loader: () => import('./edit'),
  loading: Loader,
});

const Check = Loadable({
  loader: () => import('./check'),
  loading: Loader
})

const detail = Loadable({
  loader: () => import('./detail'),
  loading: Loader
})

export default class RouteApp extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={List} />
        <Route path={`${match.url}/list`} component={List} />
        <Route path={`${match.url}/edit/:id?`} component={Edit} />
        <Route path={`${match.url}/category`} component={Category} />
        <Route path={`${match.url}/check`} component={Check} />
        <Route path={`${match.url}/detail/:id?`} component={detail} />
      </Switch>
    );
  }
}
