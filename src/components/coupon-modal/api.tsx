import { newPost } from '@/util/fetch';
import { SearchPayload } from './index'
export function fetchCoupontList (payload: SearchPayload) {
	return newPost(`/coupon/get/couponList`, payload)
}