declare namespace Marketing {
  /** 赠品内容value属性 */
  interface PresentContentValueProps {
    /** 赠品内容类型：0-赠品，1-优惠券 */
    type?: 0 | 1
    chooseCount?: number
    couponList?: Shop.CouponProps[]
    skuList?: Shop.SkuProps[]
    spuList?: Shop.ShopItemProps[]
    spuIds: {[spuId: number]: number[]}
    /** 赠送商品数 */
    chooseCount?: number
    /** 满赠条件购买商品数 */
    stageCount?: number
    giftSkuJson?: string
  }
  interface ActivityListPayloadProps {
    name?: string
    startTime?: number
    endTime?: number
    createStartTime?: number
    createEndTime?: number
    page?: number
    pageSize?: number
    /** 活动类型，1-限时秒杀，2-今日拼团，3-礼包，4-激活码，5-地推专区，6-体验团长专区，7-采购专区，8-买赠 */
    type?: number
  }
  /** 满赠详情新增/修改传参属性 */
  interface FormDataProps {
    /** 活动名称 */
    title: string
    /** 活动开始时间 */
    startTime: number
    /** 活动结束时间 */
    endTime: number
    /** 活动规则描述 */
    activityDescribe: string
    id: number
    /** 赠品策略类型 0-循环规则，1-阶梯规则 */
    strategyType: 0 | 1
    product: PresentContentValueProps
    /** 循环规则 */
    loop: PresentContentValueProps
    rank: {
      /** 阶梯规则：0-不可叠加，1-可叠加 */
      ladderRule: 0 | 1
      ruleList: PresentContentValueProps[]
    }
    userScope: any[]
  }
}