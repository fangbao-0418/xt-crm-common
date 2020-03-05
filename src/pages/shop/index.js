import React from 'react';
import { Route, Switch } from 'react-router-dom';
import loadable from '@/util/loadable'

const Boss = loadable(() => import('./boss'));
const BossDetail = loadable(() => import('./boss-detail'));
const Goods = loadable(() => import('./goods'));
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