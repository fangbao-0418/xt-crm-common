/**
 * 过滤子订单数据
 */
export function filterChildOrderData (list: any[], orderStatus: number) {
  return (list || []).map((v: any) => {
    // 当订单状态是代付款的时候你就别显示实付金额
    v.preferentialTotalPrice = orderStatus > 10 ? v.preferentialTotalPrice : ''
    return v
  })
}