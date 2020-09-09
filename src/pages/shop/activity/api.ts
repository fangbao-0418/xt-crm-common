const { get, newPost } = APP.http

export type StatusType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
/** 会场活动列表 */
export function getPromotionList (payload: {
  title?: string,
  status?: StatusType,
  startTime?: number,
  endTime?: number,
  promotionId?: string,
  shopId?: string,
  shopName?: string,
  page: number,
  pageSize: number
}) {
  return get('/mcweb/product/promotion/venue/list', payload)
}

/** 新建会场活动 */
export function addPromotion (payload: {
  title: string,
  type: number,
  description: string,
  applyStartTime: number,
  applyEndTime: number,
  preheat: 0 | 1,
  startTime: number,
  endTime: number,
  costPriceDiscount: number,
  shopIds: number[]
}) {
  return newPost('/mcweb/product/promotion/venue/add', payload)
}