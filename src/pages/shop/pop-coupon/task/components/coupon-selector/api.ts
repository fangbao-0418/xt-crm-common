// import { SearchPayload } from './components/coupon/SelectModal'
const { post, get, newPost } = APP.http

/** 获取优惠券列表 */
export function fetchCouponList (payload: any) {
  return newPost('/mcweb/coupon/pop/list', payload)
}