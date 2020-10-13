const { get, newPost } = APP.http

/** 收益类型 */
export enum EarningsType {
  价差收益 = 10,
  平推收益 = 20
}

/** 订单收益结算快照 */
export function getEarningsDetail(payload: {
  childOrderNo: string
  memberId: number
}) {
  return get('/crm/member/settlement/v1/orderSettlementSnapshot', payload).then((res) => {
    res.preferentialTotalPrice = APP.fn.formatMoneyNumber(res.preferentialTotalPrice, 'm2u')
    res.priceDetail = [
      {
        dealPrice: APP.fn.formatMoneyNumber(res.dealPrice, 'm2u'),
        headPrice: APP.fn.formatMoneyNumber(res.headPrice, 'm2u'),
        areaMemberPrice: APP.fn.formatMoneyNumber(res.areaMemberPrice, 'm2u'),
        cityMemberPrice: APP.fn.formatMoneyNumber(res.cityMemberPrice, 'm2u'),
        managerMemberPrice: APP.fn.formatMoneyNumber(res.managerMemberPrice, 'm2u'),
      }
    ]
    return res
  })
}

/** 整单收益信息 */
export function getOrderSettlement (mainOrderId: number) {
  return get(`/mcweb/account/pop/sale/settlement/order?mainOrderId=${mainOrderId}`)
}

/** 收益订单详情 */
export function getSettlementOrderDetail (payload: {
  /** 子订单id */
  childOrderId: number
  /** 会员id */
  memberId: number
}) {
  return newPost('/mcweb/account/pop/sale/settlement/order/detail', payload)
}

/** SKU收益列表 */
export function getSaleSettlementSku (childOrderId: number) {
  return get(`/mcweb/account/pop/sale/settlement/sku?childOrderId=${childOrderId}`)
}

/** pop订单收益重算 */
export function saleSettlementRecalculate (mainOrderId: number) {
  return get(`/mcweb/account/pop/sale/settlement/recalculate?mainOrderId=${mainOrderId}`)
}