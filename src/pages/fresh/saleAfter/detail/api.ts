const { post, get, newPost, newPut } = APP.http

/**
 * 获取订单详情
 * @param refundCode
 */
export const getOrderDetail = (refundCode: string) => {
  return newPost(`/order/fresh/saleAfter/detail?refundCode=${refundCode}`)
}

/**
 * 审核和确认收货
 * @param data
 */
export const orderAudit= (data: string) => {
  return newPost('/order/fresh/saleAfter/audit', data)
}

/**
 * 获取订单轨迹
 * @param skuServerId,orderCode
 */
export const getOrderTrajectory = (skuServerId: string, orderCode: string) => {
  return get(`/order/afterSale/getSkuServerProcessDetailList/${skuServerId}?orderCode=${orderCode}`)
}