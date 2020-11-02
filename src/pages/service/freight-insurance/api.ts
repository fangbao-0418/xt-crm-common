const { newPost } = APP.http

/**
 * childOrderCode 订单号
 * thirdInsuranceSn 保单号
 * insuranceStartTime 开始时间
 * insuranceEndTime 结束时间
 * insuranceStatus 保险状态 5-未生效 10-保障中 15-理赔成功 20-理赔失败 25-取消
 */
interface Payload {
  childOrderCode?: string
  thirdInsuranceSn?: string
  insuranceStartTime?: number
  insuranceEndTime?: number
  insuranceStatus?: '5' | '10' | '15' | '20' | '25'
  page: number
  pageSize: number
}
/**
 * @param payload
 */
export function getList (payload: Payload) {
  return newPost('/mcweb/trade/insurance/freight/pageDataList', payload)
}

/**
 * 运费险重新支付
 * @param insuranceId
 */
export function rePaid (insuranceId: number) {
  return newPost('/msweb/trade/insurance/freight/rePaid', { insuranceId })
}



/**
 * 导出运费险列表
 * exportType：1 投保 2 理赔
 * @param payload
 */
export function exportInsures (payload: Payload) {
  return newPost('/mcweb/trade/insurance/freight/export', payload)
}
