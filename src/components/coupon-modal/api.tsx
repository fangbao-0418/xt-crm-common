import { newPost } from '@/util/fetch';
import { SearchPayload } from './index'
export function fetchCouponList (payload: SearchPayload) {
	return newPost(`/coupon/get/couponList`, payload)
}