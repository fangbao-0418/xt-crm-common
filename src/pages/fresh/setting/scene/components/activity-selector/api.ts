const { get, newPost, post } = APP.http

/**
 * 获取买菜活动列表
 * @param payload {any}
 */
export function fetchPromotionList (payload: any) {
  // return post('/promotion/list', payload)
  payload.type = 51
  return post('/promotion/freshList', payload)
}
