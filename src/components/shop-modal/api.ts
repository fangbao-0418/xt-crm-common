import { post } from '@/util/fetch';
import { SearchPayload } from './index'
export function fetchShopList (payload: SearchPayload) {
	return post(`/product/list`, payload)
}