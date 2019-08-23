import React from 'react';
import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';
import { view as Loader } from '../../components/loader';

const CouponList = Loadable({
  loader: () => import('./list'),
  loading: Loader,
});
const BulkIssuing = Loadable({
  loader: () => import('./list/bulk-issuing'),
  loading: Loader,
});

const CouponInfo = Loadable({
  loader: () => import('./list/coupon-info'),
  loading: Loader,
});

const CouponDetail = Loadable({
  loader: () => import('./list/coupon-detail'),
  loading: Loader,
});

export default class RouteApp extends React.Component {
  render() {
    const { match } = this.props;
    console.log('match=>', match);
    return (
      <Switch>
        <Route exact path={`${match.url}/get/couponList`} component={CouponList} />
        <Route path={`${match.url}/get/couponList/bulkissuing`} component={BulkIssuing} />
        <Route path={`${match.url}/get/couponList/couponinfo`} component={CouponInfo} />
        <Route path={`${match.url}/get/couponList/detail/:id`} component={CouponDetail} />
      </Switch>
    );
  }
}
