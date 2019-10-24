import React from 'react';
import Loadable from 'react-loadable';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { view as Loader } from '@/components/loader';
const List = Loadable({
  loader: () => import('./list'),
  loading: Loader,
});
interface Props extends RouteComponentProps {}
class Main extends React.Component<Props> {
  public render () {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}/list`} component={List} />
      </Switch>
    )
  }
}
export default Main
