import React from 'react';
import Loadable from 'react-loadable';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { view as Loader } from '@/components/loader';
/** 对账单列表 */
const CheckingList = Loadable({
  loader: () => import('./checking'),
  loading: Loader,
});
const CheckingDetail = Loadable({
  loader: () => import('./checking/Detail'),
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
/** 结算明细 */
const SettlementDetail = Loadable({
  loader: () => import('./settlement/detail'),
  loading: Loader,
});
/** 付款单列表 */
const PaymentList = Loadable({
  loader: () => import('./payment'),
  loading: Loader,
});
interface Props extends RouteComponentProps {}
class Main extends React.Component<Props> {
  public render () {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}/checking`} component={CheckingList} />
        <Route exact path={`${match.url}/checking/:id`} component={CheckingDetail} />
        <Route exact path={`${match.url}/adjustment`} component={AdjusmentList} />
        <Route exact path={`${match.url}/settlement`} component={SettlementList} />
        <Route exact path={`${match.url}/settlement/detail/:id`} component={SettlementDetail} />
        <Route exact path={`${match.url}/payment`} component={PaymentList} />
      </Switch>
    )
  }
}
export default Main
