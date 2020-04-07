const { newPost } = APP.http

// 买赠/满减满折活动列表查询
export function queryDiscounts(params) {
  return newPost('/promotion/queryDiscounts', params)
}

// 添加满减满折活动
export function addFullDiscounts(params) {
  return newPost('/promotion/addFullDiscounts', params)
}