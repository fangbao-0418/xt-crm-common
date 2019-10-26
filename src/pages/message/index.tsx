import React from 'react';
import Loadable from 'react-loadable';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { view as Loader } from '@/components/loader';
/** 消息列表 */
const MessageList = Loadable({
  loader: () => import('./list'),
  loading: Loader,
});
/** 消息详情 */
const MessageDetail = Loadable({
  loader: () => import('./list/detail'),
  loading: Loader,
});

interface Props extends RouteComponentProps {}
class Main extends React.Component<Props> {
  public render () {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}/list`} component={MessageList} />
        <Route exact path={`${match.url}/detail/:id`} component={MessageDetail} />
      </Switch>
    )
  }
}
export default Main
