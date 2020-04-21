const { post, newPost } = APP.http;

// 买赠/满减满折活动列表查询
export function queryDiscounts(params) {
  return post('/promotion/queryDiscounts', {
    ...params,
    /** 活动类型，1-限时秒杀，2-今日拼团，3-礼包，4-激活码，5-地推专区，6-体验团长专区，7-采购专区，8-买赠， 9-团购 10-拼团 11-满减 12-满折 */
    promotionTypes: '11,12'
  })
}

//关闭活动
export function disableDiscounts(params) {
  return newPost('/promotion/disableDiscounts', params)
}