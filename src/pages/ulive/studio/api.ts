const { post, get, newPost, newPut } = APP.http
/** 直播列表 */
export const getStudioList = (payload: any) => {
  return get('::ulive/live/plan/list', payload)
}
/** 获取直播计划详情 */
export const fetchPlanInfo = (planId: number) => {
  return get<UliveStudio.ItemProps>(`::ulive/live/plan/${planId}`)
}
/** 停播 */
export const stopPlay = (payload: {
  breakReason: string
  /** 是否拉黑主播(0-不拉黑, 1-拉黑) */
  isBlock: 0 | 1
  planId: number
}) => {
  return newPut('::ulive/live/plan/break', payload)
}
/** 上下架 */
export const changeStatus = (payload: {
  planId: number
  status: 0 | 1
}) => {
  return newPut('::ulive/live/plan/status/update', payload)
}
/** 置顶 */
export const setTop = (payload: {
  planId: number
  /** 0-不置顶, 1-置顶) */
  isTop: 0 | 1
}) => {
  return newPut('::ulive/live/plan/top', payload)
}
/** 修改封面 */
export const changeCover = (payload: {
  planId: number
  bannerUrl: string
}) => {
  return newPut('::ulive/live/plan/banner', payload)
}
/** 审核 */
export const audit = (payload: {
  /** 审核原因，审核不通过必填 */
  auditReason?: string
  /** 审核状态(0-审核未通过, 1-审核通过) */
  auditStatus: 0 | 1
  planId: number
}) => {
  return newPut('::ulive/live/plan/audit', payload)
}
/** 获取小程序微信太阳码 */
export const getWxQrcode = (payload: {
  host?: string
  linkUrl?: string
  page: string
  scene: string
}) => {
  return newPost('::ulive/live/plan/code', payload)
}
/** 获取举报列表 */
export const fetchComplainList = (payload: {
  livePlanId: any
  pageSize: number
  page: number
}) => {
  return get('::ulive/live/complain/list', payload)
}