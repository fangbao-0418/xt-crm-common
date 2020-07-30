const { post } = APP.http

export function getOrderlist (data: any) {
  return post('/order/afterSale/list', {
    ...data,
    refundStatus: [10]
  })
}