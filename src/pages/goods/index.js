/*
 * @Date: 2020-04-21 19:44:05
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-07 19:35:02
 * @FilePath: /xt-crm/src/pages/goods/index.js
 */
import React from 'react'
import { Redirect } from 'react-router'
import loadable from '@/util/loadable'
import Category from './category/index.js'
import RouteComponent, { RouteCO } from '@/components/route-component'
const SkuSale = loadable(() => import('./sku-sale'))
const Check = loadable(() => import('./check'))
const Detail = loadable(() => import('./detail'))
const PricingStrategy = loadable(() => import('./pricing-strategy'))
const GoodsDetail = loadable(() => import('./goods-detail'))
const SkuSaleForm = loadable(() => import('./sku-sale/form'))
const SkuStock = loadable(() => import('./sku-stock'))
const SkuStockForm = loadable(() => import('./sku-stock/form'))
const Material = loadable(() => import('./material'))
const Virtual = loadable(() => import('./virtual'))

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
  { path: '/virtual', component: Virtual }
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
