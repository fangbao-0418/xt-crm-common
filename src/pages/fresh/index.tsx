import React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import Store from './store';
import StoreForm from './store/form';

class Fresh extends React.Component<RouteComponentProps> {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route path={`${match.url}/store`} component={Store} exact />
        <Route path={`${match.url}/store/:id`} component={StoreForm} />
      </Switch>
    )
  }
}

export default Fresh;