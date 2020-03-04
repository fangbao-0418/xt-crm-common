import React from 'react';
import { Route, Switch } from 'react-router-dom';
import loadable from '@/util/loadable'

const SkuSale = loadable(() => import('./sku-sale'));
const Check = loadable(() => import('./check'));
const GoodsForm = loadable(() => import('./sku-sale/form'));
export default class RouteApp extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={SkuSale} />
        <Route path={`${match.url}/list`} component={SkuSale} />
        <Route path={`${match.url}/check`} component={Check} />
        <Route path={`${match.url}/sku-sale/:id`} component={GoodsForm} />
      </Switch>
    );
  }
}
