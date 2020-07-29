const { newPost } = APP.http

export function getOrderlist (data: any) {
  console.log(data, 123)
  return newPost('/order/afterSale/list', {
    ...data,
    refundStatus: [10]
  })
}