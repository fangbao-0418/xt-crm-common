import React from 'react';
import Loadable from 'react-loadable';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { view as Loader } from '@/components/loader';
/** 主播列表 */
const AnchorList = Loadable({
  loader: () => import('./anchor'),
  loading: Loader,
});

/** 直播列表 */
const StudioList = Loadable({
  loader: () => import('./studio'),
  loading: Loader,
});

/** 举报详情 */
const InformDetail = Loadable({
  loader: () => import('./studio/Inform'),
  loading: Loader,
});

/** 直播频道管理 */
const Config = Loadable({
  loader: () => import('./config'),
  loading: Loader,
});

interface Props extends RouteComponentProps {}
class Main extends React.Component<Props> {
  public render () {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}/anchor`} component={AnchorList} />
        <Route exact path={`${match.url}/studio`} component={StudioList} />
        <Route exact path={`${match.url}/inform/:id`} component={InformDetail} />
        <Route exact path={`${match.url}/config`} component={Config} />
      </Switch>
    )
  }
}
export default Main
