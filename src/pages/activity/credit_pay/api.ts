const { post, get, newPost } = APP.http
import * as adapter from './adapter'

/** 获取分期商品列表 */
export const fetchList = (payload: CreditPay.PayloadProps) => {
  return post<PageProps<CreditPay.ItemProps>>(`/product/list`, payload)
}
/** 添加花呗分期商品 */
export const addCreditPayShop = (ids: number[]) => {
  return newPost(`/product/huabei/add_batch`, ids)
}
/** 删除花呗分期商品 */
export const deleteCreditPayShop = (ids: number[]) => {
  return newPost(`/product/huabei/delete_batch`, ids)
}
/** 查看花呗分期商品详情信息 */
export const fetchCreditPayShopDetail = (id: number) => {
  return post(`/product/detail?productId=${id}`)
}
/** 查看sku每期还款额 */
export const fetchCostDetail = (skuId: number) => {
  return get(`/product/huabei/get_hb_fq_cost?skuId=${skuId}`).then((res) => {
    return adapter.handleCostDetailData(res)
  })
}

/** 修改sku分期 */
export const updateCostDetail = (payload: {
  productId: number,
  skuInfos: {skuId: number, maxHbFqNum: number, maxFqSellerPercent: number}[]
}) => {
  return newPost(`/product/huabei/update`, payload)
}
