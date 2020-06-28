/*
 * @Author: fangbao
 * @Date: 2020-05-19 23:09:49
 * @LastEditors: fangbao
 * @LastEditTime: 2020-06-05 21:48:15
 * @FilePath: /xt-crm-microservice/common/src/routes/modules.ts
 */
import Loadable from '@/util/loadable'

export { view as Login } from '@/pages/login'
export const Home = Loadable(() => import('@/pages/home'))
export const Settings = Loadable(() => import('@/pages/settings'))
export const Goods = Loadable(() => import('@/pages/goods'))
export const Template = Loadable(() => import('@/pages/template'))
export const Order = Loadable(() => import('@/pages/order'))
export const Activity = Loadable(() => import('@/pages/activity'))
export const Coupon = Loadable(() => import('@/pages/coupon'))
export const User = Loadable(() => import('@/pages/user'))
export const Supplier = Loadable(() => import('@/pages/supplier'))
export const Banner = Loadable(() => import('@/pages/banner'))
export const Finance = Loadable(() => import('@/pages/finance'))
export const Auth = Loadable(() => import('@/pages/auth'))
export const Interface = Loadable(() => import('@/pages/interface'))
export const CrudPage = Loadable(() => import('@/components/crudPage'))
export const Message = Loadable(() => import('@/pages/message'))
export const Setting = Loadable(() => import('@/pages/setting'))
export const ULive = Loadable(() => import('@/pages/ulive'))
export const MerchantAccounts = Loadable(() => import('@/pages/merchant-accounts'))
export const Shop = Loadable(() => import('@/pages/shop'))
export const Fresh = Loadable(() => import('@/pages/fresh'))
export const System = Loadable(() => import('@/pages/system'))