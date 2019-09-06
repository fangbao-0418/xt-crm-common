import { get, newPost, post, request } from '@/util/fetch';
export function saveSpecial (payload: Special.DetailItem) {
	const data = {...payload}
  return newPost('/crm/subject/save', data);
}

export function fetchSpecialList (data?: Special.SearchProps) {
  return get('/crm/subject/pageQuery', data);
}

/** 通过商品ids获取商品列表 */
export function fetchShopListByIds (ids: number[]) {
	return post('/product/listInIds', {ids})
}

export function fetchSpecialDetial (id: number) {
	return get(`/crm/subject/detail/${id}`)
}

export function deleteSpecial (subjectIds: number[]) {
	return newPost(`/crm/subject/delete`, {
		ids: subjectIds
	})
}

export function changeSpecialStatus (subjectIds: number[], status: 0 | 1 | undefined) {
	 return status === 1 ? newPost(`/crm/subject/inactive`, {
		ids: subjectIds
	}) : newPost(`/crm/subject/active`, {
		ids: subjectIds
	})
}
