import Loadable from '@/util/loadable'
export { view as Login } from '@/pages/login'
export const Home = Loadable(() => import('@/pages/home'))
export const Settings = Loadable(() => import('@/pages/settings'))
export const Goods = Loadable(() => import('@/pages/goods'))
export const Template = Loadable(() => import('@/pages/template'))
export const Order = Loadable(() => import('@/pages/order'))
export const User = Loadable(() => import('@/pages/user'))
export const Supplier = Loadable(() => import('@/pages/supplier'))
export const Banner = Loadable(() => import('@/pages/banner'))
export const Finance = Loadable(() => import('@/pages/finance'))
export const Auth = Loadable(() => import('@/pages/auth'))
export const Interface = Loadable(() => import('@/pages/interface'))
export const CrudPage = Loadable(() => import('@/components/crudPage'))
export const Setting = Loadable(() => import('@/pages/setting'))
export const MerchantAccounts = Loadable(() => import('@/pages/merchant-accounts'))
export const Shop = Loadable(() => import('@/pages/shop'))
export const System = Loadable(() => import('@/pages/system'))
export const Download = Loadable(() => import('@/pages/download'))