import { newPost, newGet } from '@/util/fetch'
// 获取优惠券详情
export function getCouponDetail (id) {
  return newGet(`/mcweb/coupon/pop/detail?couponId=${id}`)
}

// 获取优惠券列表
export function getCouponlist (data) {
  return newPost('/mcweb/coupon/pop/list', data)
}
