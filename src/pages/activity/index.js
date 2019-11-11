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

/** 满赠列表 */
const Marketing = Loadable({
  loader: () => import('./marketing'),
  loading: Loader,
});

/** 满赠详情 */
const MarketingDetail = Loadable({
  loader: () => import('./marketing/detail'),
  loading: Loader
})

/** 花呗分期列表 */
const CreaditPay = Loadable({
  loader: () => import('./credit_pay'),
  loading: Loader,
});

/** 花呗分期详情 */
const CreaditPayDetail = Loadable({
  loader: () => import('./credit_pay/Detail'),
  loading: Loader,
});
/** 抽奖列表 */
const LuckDrawList = Loadable({
  loader: () => import('./luckdraw/list'),
  loading: Loader,
});
/** 手动添加抽奖码 */
const LuckDrawAdd = Loadable({
  loader: () => import('./luckdraw/add'),
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
        <Route path={`${match.url}/marketing`} exact component={Marketing} />
        <Route path={`${match.url}/marketing/:type/:id`} component={MarketingDetail} />
        <Route path={`${match.url}/credit_pay`} exact component={CreaditPay} />
        <Route path={`${match.url}/credit_pay/:id`} component={CreaditPayDetail} />
        <Route path={`${match.url}/luckdraw/list`} component={LuckDrawList} />
        <Route path={`${match.url}/luckdraw/add`} component={LuckDrawAdd} />
      </Switch>
    );
  }
}
