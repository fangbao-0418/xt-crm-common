/*
 * @Date: 2020-05-21 14:51:40
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-21 14:52:56
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/order/index.js
 */

import React from 'react'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'
import { view as Loader } from '../../components/loader'
import Detail from './detail'
import Refund from './refund'
import QuestionList from './refund/question-list'
import ServiceCenter from './refund/service-center'
import ServiceCenterAdd from './refund/service-center/add'
import RefundDetail from './refund/detail'
import AutoRefund from './auto-refund'
import AutoRefundDetail from './auto-refund/detail'
import Recharge from './recharge'
import Download from './download-list'
import AfterDownload from './after-download-list'
import CompensateOrder from './compensate-order'
import CompensateOrderDetail from './compensate-order/detail'

const Main = Loadable({
  loader: () => import('./main'),
  loading: Loader
})

export default class RouteApp extends React.Component {
  render () {
    const { match } = this.props

    return (
      <Switch>
        <Route path={`${match.url}/recharge`} component={Recharge} />
        <Route path={`${match.url}/download`} component={Download} />
        <Route path={`${match.url}/after-download`} component={AfterDownload} />
        <Route path={`${match.url}/detail/:id`} component={Detail} />
        <Route exact path={`${match.url}/refundOrder`} component={Refund} />
        <Route exact path={`${match.url}/questionlist`} component={QuestionList} />
        <Route exact path={`${match.url}/servicecenter`} component={ServiceCenter} />
        <Route exact path={`${match.url}/servicecenter/:id`} component={ServiceCenterAdd} />
        <Route exact path={`${match.url}/refundOrder/:id/:sourceType?`} component={RefundDetail} />
        <Route exact path={`${match.url}/autoRefundRule`} component={AutoRefund} />
        <Route exact path={`${match.url}/autoRefundRule/create/:id?`} component={AutoRefundDetail} />
        <Route exact path={`${match.url}/compensate-order`} component={CompensateOrder} />
        <Route exact path={`${match.url}/compensate-order/:compensateCode`} component={CompensateOrderDetail} />
        <Route path={`${match.url}`} component={Main} />
      </Switch>
    )
  }
}