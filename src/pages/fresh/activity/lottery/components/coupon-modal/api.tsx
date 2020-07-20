import { newPost } from '@/util/fetch'
import { SearchPayload } from './index'
export function fetchCouponList (payload: SearchPayload) {
  return newPost('/mcweb/coupon/fresh/get/couponList', payload)
}