import React from 'react';
import { Route, Switch } from 'react-router-dom';
import loadable from '@/util/loadable'

/** 店长管理 */
const Boss = loadable(() => import('./boss'));
/** 店长详情 */
const BossDetail = loadable(() => import('./boss-detail'));
/** 小店商品 */
const Goods = loadable(() => import('./goods'));
/** 佣金配置 */
const Commission = loadable(() => import('./commission'));

class Main extends React.Component {
  render() {
    const { match } = this.props;

    return <Switch>
      <Route exact path={`${match.url}`} component={Boss} />
      <Route exact path={`${match.url}/boss`} component={Boss} />
      <Route exact path={`${match.url}/boss/detail/:id`} component={BossDetail} />
      <Route path={`${match.url}/goods`} component={Goods} />
      <Route path={`${match.url}/commission`} component={Commission} />
    </Switch>
  }
}
export default Main