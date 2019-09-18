import { newPost } from '@/util/fetch';
import { SearchPayload } from './index'
export function fetchShopList (payload: SearchPayload) {
	return newPost(`/coupon/get/couponList`, payload)
}