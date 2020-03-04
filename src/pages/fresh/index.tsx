import React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import Store from './store';
import Goods from './goods';
import StoreForm from './store/form';
import Order from './order';
class Fresh extends React.Component<RouteComponentProps> {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route path={`${match.url}/store`} component={Store} exact />
        <Route path={`${match.url}/goods`} component={Goods} />
        <Route path={`${match.url}/store/:id`} component={StoreForm} />
        <Route path={`${match.url}/order`} component={Order} />
      </Switch>
    )
  }
}

export default Fresh;