export interface MemberSnapshot {
  memberId: number
  memberNickName: string
  memberType: number
  parentMemberId: number
  invitedId: number
  isBuyer: boolean
  isCurrentMember: boolean
  memberMobile: string
  incomeTypeDesc: string
}

/** 收益快照 */
export interface EarningsSnapshot {
  id: string
  /** 主订单 */
  orderCode: string
  /** 商品名称 */
  skuName: string
  /** 实付金额 */
  preferentialTotalPrice: number
  /** 商品数量 */
  quantity: number
  /** 收益受益人ID */
  memberId: number
  /** 收益受益人手机号 */
  memberMobile: string
  /** 收益受益人会员等级 */
  memberType: number
  /** 收益受益人昵称 */
  memberNickName: string
  /** 下单人ID */
  buyerId: number
  /** 下单人昵称 */
  buyerNickName: string
  /** 下单人会员等级 */
  buyerType: number
  /** 下单人手机号 */
  buyerMobile: string
  /** 收益类型描述 */
  incomeTypeDesc: string
  /** 活动价格 */
  dealPrice: number
  /** 团长价 */
  headPrice: number
  /** 区长价 */
  areaMemberPrice: number
  /** 合伙人价 */
  cityMemberPrice: number
  /** 管理员价 */
  managerMemberPrice: number
  /** 售后扣除比例 */
  deductRatio: number
  /** 是否是受益人 */
  isCurrentMember: string
  /** 收益总金额 */
  totalAmount: number
  /** 已结算收益金额 */
  settledAmount: number
  /** 未结算收益金额 */
  unSettledAmount: number
  /** 售后记录 */
  afterSales: {
    orderCode: string
    /** 售后类型 */
    refundTypeDesc: string
    /** 售后金额 */
    refundAmount: number
  }[]
  /** 会员层级快照 */
  memberSnapshots: MemberSnapshot[]
  details: EarningsRecord[]
  /** 层级价格快照 */
  priceDetail: {
    /** 活动价格 */
    dealPrice: number
    /** 团长价 */
    headPrice: number
    /** 区长价 */
    areaMemberPrice: number
    /** 合伙人价 */
    cityMemberPrice: number
    /** 管理员价 */
    managerMemberPrice: number
  }[]
}

export interface EarningsRecord {
  id: any
  /** 收益金额 */
  amount: number
  /** 收益类型 */
  incomeTypeDesc: string
  /** 事件 */
  operatorTypeDesc: string
  orderCode: string
  /** 子订单号 */
  childOrderNo: string
  /** 结算状态 */
  settleStatus: string
  /** 结算时间 */
  settleTime: string
  occurrenceTime: string
}