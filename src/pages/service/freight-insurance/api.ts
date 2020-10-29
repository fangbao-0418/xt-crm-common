const { newPost } = APP.http

/**
 * @param payload
 * childOrderCode 订单号
 * thirdInsuranceSn 保单号
 * insuranceStartTime 开始时间
 * insuranceEndTime 结束时间
 * insuranceStatus 保险状态 5-未生效 10-保障中 15-理赔成功 20-理赔失败 25-取消
 */
export function getList (payload: {
  childOrderCode?: string
  thirdInsuranceSn?: string
  insuranceStartTime?: number
  insuranceEndTime?: number
  insuranceStatus?: '5' | '10' | '15' | '20' | '25'
  page: number
  pageSize: number
}) {
  return newPost('/mcweb/trade/insurance/freight/pageDataList', payload)
}

/**
 * insuranceId number
 * @param insuranceId
 */
export function rePaid (insuranceId: number) {
  return newPost('/msweb/trade/insurance/freight/rePaid', { insuranceId })
}

// export function name (params:type) {
  
// }