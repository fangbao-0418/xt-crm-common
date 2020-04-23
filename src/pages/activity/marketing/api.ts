import { SearchPayload } from './components/coupon/SelectModal'
import * as adapter from './adapter'
const { post, get, newPost } = APP.http

/** 获取满赠列表 */
export const fetchMarketingList = (payload: Marketing.ActivityListPayloadProps) => {
  payload.promotionTypes = '8'
  return post('/promotion/queryDiscounts', payload).then((res) => {
    res.records = adapter.handleMarketingListData(res.records)
    return res
  })
}

/** 获取活动列表 */
export const fetchActivityList = (payload: Marketing.ActivityListPayloadProps) => {
  return post('/promotion/list', payload).then((res) => {
    res.records = adapter.handleActivityListData(res.records)
    return res
  })
}

/** 关闭开启活动 */
export const changeActivityStatus = (ids: number[]) => {
  let url = '/promotion/disableDiscounts'
  return newPost(url, {
    promotionIds: ids
  })
}

/** 获取满赠详情 */
export const fetchActivityDetail = (id: any) => {
  return get('/promotion/detailDiscounts', {
    promotionId: id
  }).then((res: any) => {
    return adapter.handleDetailReturnData(res)
  })
}

/** 新增买赠活动 */
export const addActivity = (payload: Marketing.FormDataProps) => {
  return newPost(`/promotion/addDiscounts`, {
    ...adapter.handleFormData(payload),
    giftRefType: 1
  })
}

/** 修改买赠活动 */
export const editActivity = (payload: Marketing.FormDataProps) => {
  return newPost(`/promotion/updateDiscounts`, adapter.handleFormData(payload))
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
	return get<PageProps<Shop.ShopItemProps>>(`/promotion/promotionProductList`, payload).then((res) => {
    res.records =  (res.records || []).map((item) => {
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

/** 获取优惠券列表 */
export function fetchCouponList (payload: SearchPayload) {
	return newPost(`/coupon/get/couponList`, payload)
}