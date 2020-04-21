const { get } = APP.http

// 查看满赠/满折满减活动详情
export function detailFullDiscounts(promotionId) {
  return get('/promotion/detailFullDiscounts', { promotionId })
}
