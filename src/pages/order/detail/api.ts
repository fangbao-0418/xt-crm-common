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
export function getOrderSettlement () {
  return get('/mweb/account/order/settlement')
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