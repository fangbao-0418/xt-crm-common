import React from 'react';
import { Route, Switch } from 'react-router-dom';
import loadable from '@/util/loadable'
import Category from './category/index.js';

const List = loadable(() => import('./view'));
const Check = loadable(() => import('./check'));
const Detail = loadable(() => import('./detail'));
const PricingStrategy = loadable(() => import('./pricing-strategy'));
const GoodsDetail = loadable(() => import('./goods-detail'));
const SkuSaleForm = loadable(() => import('./sku-sale/form'));
const SkuStock = loadable(() => import('./sku-stock'));
const SkuStockForm = loadable(() => import('./sku-stock/form'));
export default class RouteApp extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={List} />
        <Route path={`${match.url}/list`} component={List} />
        <Route path={`${match.url}/category`} component={Category} />
        <Route path={`${match.url}/check`} component={Check} />
        <Route path={`${match.url}/detail/:id?`} component={Detail} />
        <Route path={`${match.url}/pricingStrategy`} component={PricingStrategy} />
        <Route path={`${match.url}/goodsDetail/:id`} component={GoodsDetail} />
        <Route path={`${match.url}/sku-sale/:id`} component={SkuSaleForm} />
        <Route exact path={`${match.url}/sku-stock`} component={SkuStock} />
        <Route path={`${match.url}/sku-stock/:id`} component={SkuStockForm} />
      </Switch>
    );
  }
}
