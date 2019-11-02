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
/** 消息模板列表 */
const TemplateList = Loadable({
  loader: () => import('./template'),
  loading: Loader,
});
/** 模板详情 */
const TemplateDetail = Loadable({
  loader: () => import('./template/detail'),
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
         <Route exact path={`${match.url}/template`} component={TemplateList} />
        <Route exact path={`${match.url}/template/detail/:id`} component={TemplateDetail} />
      </Switch>
    )
  }
}
export default Main
