/*
 * @Date: 2020-04-16 13:58:08
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-07 20:09:20
 * @FilePath: /xt-crm/src/pages/interface/index.js
 */
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Category from './category'
import Hotkey from './hotkey'
import HomeIcon from './home-icon'
import Special from './special'
import SpecialDetail from './special/Detail'
import HomeConfig from './config'
import FreeSubsidies from './free-subsidies'
import GroupBuyingCategory from './group-buying/category'
import GroupBuyingCategoryForm from './group-buying/category/form'
import PurchaseCategory from './purchase-category'
import PurchaseCategoryForm from './purchase-category/form'
import SpecialContent from './special/content'
import SpecialContentForm from './special/content/form'
import GoodsRecommend from './goods-recommend'
import GoodsRecommendDetail from './goods-recommend/Detail'
import RechargeConfig from './recharge-config'
import Store from './store'
import CategoryRanking from './category-ranking'
export default class extends Component {
  render () {
    return (
      <Switch>
        <Route path='/interface/category' component={Category} />
        <Route path='/interface/hotkey' component={Hotkey} />
        <Route path='/interface/special' exact component={Special} />
        <Route path='/interface/special/:id' component={SpecialDetail} />
        <Route path='/interface/config' component={HomeConfig} />
        <Route path='/interface/free' component={FreeSubsidies} />
        <Route path='/interface/store' component={Store} />
        <Route path='/interface/group-buying/category' exact component={GroupBuyingCategory} />
        <Route path='/interface/group-buying/category/:id' component={GroupBuyingCategoryForm} />
        <Route path='/interface/purchase-category' exact component={PurchaseCategory} />
        <Route path='/interface/purchase-category/:id' component={PurchaseCategoryForm} />
        <Route path='/interface/category' component={Category} />
        <Route path='/interface/hotkey' component={Hotkey} />
        <Route path='/interface/home-icon' component={HomeIcon} />
        <Route path='/interface/special' exact component={Special} />
        <Route path='/interface/special/:id' component={SpecialDetail} />
        <Route path='/interface/config' component={HomeConfig} />
        <Route path='/interface/free' component={FreeSubsidies} />
        <Route path='/interface/special-content' exact component={SpecialContent} />
        <Route path='/interface/special-content/:id' exact component={SpecialContentForm} />
        <Route path='/interface/goods-recommend' exact component={GoodsRecommend} />
        <Route path='/interface/goods-recommend/:id' component={GoodsRecommendDetail} />
        <Route path='/interface/recharge-config' component={RechargeConfig} />
        <Route path='/interface/category-ranking' component={CategoryRanking} />
      </Switch>
    )
  }
}