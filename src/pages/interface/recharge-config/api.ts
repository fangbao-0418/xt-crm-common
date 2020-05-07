/*
 * @Date: 2020-04-28 14:00:21
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-07 20:22:01
 * @FilePath: /xt-crm/src/pages/interface/recharge-config/api.ts
 */
const { post, get, newPost } = APP.http
export const fetchList = () => {

}

/** 关闭开启活动 */
export const changeActivityStatus = (ids: number[]) => {
  const url = '/promotion/disableDiscounts'
  return newPost(url, {
    promotionIds: ids
  })
}

/** 获取商品列表 */
export function fetchSelectShopList (payload: {
  productId?: any
  productName?: string
  status?: number
  categoryIds?: string
  page?: number
  pageSize?: number
}) {
  return get<PageProps<Shop.ShopItemProps>>('/promotion/promotionProductList', payload).then((res) => {
    res.records = (res.records || []).map((item) => {
      item.skuList = item.skuList || []
      item.skuList.map((val) => {
        val.productId = item.id
        val.productName = item.productName
        val.coverUrl = item.coverUrl
        val.properties = `${item.property1 || ''}:${val.propertyValue1};${item.property2 || ''}:${val.propertyValue2}`
        return val
      })
      return item
    })
    return res
  })
}
