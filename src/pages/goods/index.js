import React from 'react'
import { Redirect } from 'react-router'
import Category from './category/index.js'
import RouteComponent, { RouteCO } from '@/components/route-component'
import SkuSale from './sku-sale'
import Check from './check'
import Detail from './detail'
import PricingStrategy from './pricing-strategy'
import GoodsDetail from './goods-detail'
import SkuSaleForm from './sku-sale/form'
import SkuStock from './sku-stock'
import SkuStockForm from './sku-stock/form'
import Material from './material/Routes'
import Virtual from './virtual'
/** 积分商城 */
import Integral from './integral'

const config = [
  { paht: '', exact: true, render: () => <Redirect to='/goods/list' /> },
  { path: '/list', component: SkuSale },
  { path: '/category', component: Category },
  { path: '/check', component: Check },
  { path: '/detail/:id?', component: Detail },
  { path: '/pricingStrategy', component: PricingStrategy },
  { path: '/goodsDetail/:id', component: GoodsDetail },
  { path: '/sku-sale/:id', component: SkuSaleForm },
  { path: '/sku-stock', exact: true, component: SkuStock },
  { path: '/sku-stock/:id', component: SkuStockForm },
  { path: '/material', component: Material },
  { path: '/virtual/:id', component: Virtual },
  { path: '/integral', component: Integral }
]

export default class RouteApp extends React.Component {
  render () {
    return (
      <RouteComponent
        config={config}
      />
    )
  }
}
