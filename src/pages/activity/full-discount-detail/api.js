const { get, newPost } = APP.http

// 查看满赠/满折满减活动详情
export function detailFullDiscounts (promotionId) {
  return get('/promotion/detailFullDiscounts', { promotionId })
}

// 商品成本检查
export function productCheckCost (params) {
  return newPost('/mcweb/promotion/productCheckCost', params)
}