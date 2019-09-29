import { SearchPayload } from './components/coupon/SelectModal'
import { handleFormData, handleDetailReturnData } from './adapter'
const { post, get, newPost } = APP.http

/** 获取满赠列表 */
export const fetchActivityList = (payload: Marketing.ActivityListPayloadProps) => {
  payload.type = 8
  return post('/promotion/list', payload)
}

/** 获取满赠详情 */
export const fetchActivityDetail = (id: any) => {
  return get('/promotion/detailDiscounts', {
    promotionId: id
  }).then((res: any) => {
    return handleDetailReturnData(res)
  })
}

/** 新增买赠活动 */
export const addActivity = (payload: Marketing.FormDataProps) => {
  return newPost(`/promotion/addDiscounts`, handleFormData(payload))
}

/** 修改买赠活动 */
export const editActivity = (payload: Marketing.FormDataProps) => {
  return newPost(`/promotion/updateDiscounts`, handleFormData(payload))
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
	return get(`/product/discountpromotion/list`, payload)
}

/** 获取优惠券列表 */
export function fetchCouponList (payload: SearchPayload) {
	return newPost(`/coupon/get/couponList`, payload)
}