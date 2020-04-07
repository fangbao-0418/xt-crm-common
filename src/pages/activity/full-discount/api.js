const { post } = APP.http;

// 买赠/满减满折活动列表查询
export function queryDiscounts(params) {
  return post('/promotion/queryDiscounts', {
    ...params,
    promotionTypes: '11,12'
  })
}