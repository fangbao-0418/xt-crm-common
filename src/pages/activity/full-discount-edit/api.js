const { get, newPost } = APP.http

// 查看满赠/满折满减活动详情
export function detailFullDiscounts(promotionId) {
  return get('/promotion/detailFullDiscounts', { promotionId })
}

// 买赠/满减满折活动列表查询
export function queryDiscounts(params) {
  return newPost('/promotion/queryDiscounts', params)
}

// 添加满减满折活动
export function addFullDiscounts(params) {
  return newPost('/promotion/addFullDiscounts', params)
}

// 更新满减满折活动
export function updateFullDiscounts(params) {
  return newPost('/promotion/updateFullDiscounts', params)
}
