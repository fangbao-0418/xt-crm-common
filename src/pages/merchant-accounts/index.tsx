import React from 'react';
import Loadable from 'react-loadable';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { view as Loader } from '@/components/loader';
/** 对账单列表 */
const CheckingList = Loadable({
  loader: () => import('./checking'),
  loading: Loader,
});
/** 调整单列表 */
const AdjusmentList = Loadable({
  loader: () => import('./adjustment'),
  loading: Loader,
});
/** 结算单列表 */
const SettlementList = Loadable({
  loader: () => import('./settlement'),
  loading: Loader,
});
interface Props extends RouteComponentProps {}
class Main extends React.Component<Props> {
  public render () {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}/checking`} component={CheckingList} />
        <Route exact path={`${match.url}/adjustment`} component={AdjusmentList} />
        <Route exact path={`${match.url}/settlement`} component={SettlementList} />
      </Switch>
    )
  }
}
export default Main
