const { post, get } = APP.http
/** 获取商品列表 */
export function fetchSelectShopList (payload: {
  productId?: any
  productName?: string
  status?: number
  categoryIds?: string
  page?: number
  pageSize?: number
}) {
  console.log(payload, 'payload')
	return post(`/product/list`, payload).then((res: any) => {
    return res
  })
}
