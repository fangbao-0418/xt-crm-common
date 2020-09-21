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
/** 小店佣金配置 */
const SmallShopCommission = loadable(() => import('./small-shop-commission'))
/** pop商品 */
const POPGoods = loadable(() => import('./pop-goods/Routes'))
/** pop优惠券 */
const POPCoupon = loadable(() => import('./pop-coupon/index'))
class Main extends React.Component {
  render () {
    const { match } = this.props
    console.log('match', match.url)
    return (
      <Switch>
        {/* <Route exact path={`${match.url}`} component={Boss} />
        <Route exact path={`${match.url}/boss`} component={Boss} />
        <Route exact path={`${match.url}/boss/detail/:id/:auditResult`} component={BossDetail} />
        <Route exact path={`${match.url}/goods`} component={Goods} />
        <Route exact path={`${match.url}/goods/detail/:id`} component={GoodsDetail} />
        <Route path={`${match.url}/popcommission`} component={PopCommission} />
        <Route path={`${match.url}/smallshopcommission`} component={SmallShopCommission} /> */}
        {/* <Route path={`${match.url}/pop-goods`} component={POPGoods} /> */}
        <Route exact path={`${match.url}/pop-coupon`} component={POPCoupon} />
      </Switch>
    )
  }
}
export default Main