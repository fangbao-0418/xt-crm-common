import React from 'react';
import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';
import { view as Loader } from '../../components/loader';

const List = Loadable({
  loader: () => import('./list'),
  loading: Loader,
});

const InfoEdit = Loadable({
  loader: () => import('./info/edit'),
  loading: Loader,
});

const Add = Loadable({
  loader: () => import('./add'),
  loading: Loader,
});

const InfoDetail = Loadable({
  loader: () => import('./info/detail'),
  loading: Loader,
});

export default class RouteApp extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={List} />
        <Route path={`${match.url}/list`} component={List} />
        <Route path={`${match.url}/info/edit/:id?`} component={InfoEdit} />
        <Route path={`${match.url}/info/detail/:id`} component={InfoDetail} />
        <Route path={`${match.url}/add`} component={Add} />
      </Switch>
    );
  }
}
