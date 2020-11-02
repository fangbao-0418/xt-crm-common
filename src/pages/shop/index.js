import React from 'react'
import { Route, Switch } from 'react-router-dom'
import loadable from '@/util/loadable'

/** 店长管理 */
const Boss = loadable(() => import('./boss'))
/** 店长详情 */
const BossDetail = loadable(() => import('./boss-detail'))
/** 小店商品 */
const Goods = loadable(() => import('./goods'))
/** 小店商品详情 */
const GoodsDetail = loadable(() => import('./goods-detail'))
/** pop佣金配置 */
const PopCommission = loadable(() => import('./pop-commission'))
/** 好店佣金配置 */
const HDCommission = loadable(() => import('./hd-commission'))
/** 小店佣金配置 */
const SmallShopCommission = loadable(() => import('./small-shop-commission'))
/** POP店管理活动管理 */
const ShopActivity = loadable(() => import('./activity'))
/** POP店管理活动管理详情 */
const ShopActivityAdd = loadable(() => import('./activity/Add'))
/** 前端会场设置 */
const ShopActivityDetail = loadable(() => import('./activity/Detail'))
/** pop商品 */
const POPGoods = loadable(() => import('./pop-goods/Routes'))
/** pop优惠券 */
const POPCoupon = loadable(() => import('./pop-coupon/list/index'))
/** pop优惠券详情 */
const POPCouponDetail = loadable(() => import('./pop-coupon/list/coupon-detail'))
class Main extends React.Component {
  render () {
    const { match } = this.props
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={Boss} />
        <Route exact path={`${match.url}/boss`} component={Boss} />
        <Route exact path={`${match.url}/boss/detail/:id/:auditResult`} component={BossDetail} />
        <Route exact path={`${match.url}/goods`} component={Goods} />
        <Route exact path={`${match.url}/goods/detail/:id`} component={GoodsDetail} />
        <Route path={`${match.url}/popcommission`} component={PopCommission} />
        <Route path={`${match.url}/hdcommission`} component={HDCommission} />
        <Route path={`${match.url}/smallshopcommission`} component={SmallShopCommission} />
        <Route path={`${match.url}/activity`} exact component={ShopActivity} />
        <Route path={`${match.url}/activity/add`} exact component={ShopActivityAdd} />
        <Route path={`${match.url}/activity/edit`} exact component={ShopActivityAdd} />
        <Route path={`${match.url}/activity/detail`} exact component={ShopActivityDetail} />
        <Route path={`${match.url}/pop-goods`} component={POPGoods} />
        <Route exact path={`${match.url}/pop-coupon`} component={POPCoupon} />
        <Route exact path={`${match.url}/pop-coupon/detail/:id`} component={POPCouponDetail} />
      </Switch>
    )
  }
}
export default Main
