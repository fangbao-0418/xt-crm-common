declare namespace Marketing {
  /** 活动类型，1-限时秒杀，2-今日拼团，3-礼包，4-激活码，5-地推专区，6-体验团长专区，7-采购专区，8-买赠， 9-团购 */
  type ActivityType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  /** 活动列表属性 */
  interface ItemProps {
    id: number
    /** 活动名称 */
    title: string
    /** 活动创建时间 */
    createTime: number
    /** 活动开始时间 */
    startTime: number 
    /** 活动结束时间 */
    endTime: number
    /** 活动状态 0-关闭, 1-未开始, 2-进行中, 3-已结束 */
    discountsStatus: number
    /** 状态 0下架，1上架 */
    status: number
    /** 变更时间 */
    modifyTime: number
    /** 操作人   */
    operator: string
    /** 活动类型，1-限时秒杀，2-今日拼团，3-礼包，4-激活码，5-地推专区，6-体验团长专区，7-采购专区，8-买赠， 9-团购 */
    type: ActivityType
    /** 活动类型文本 */
    activityTypeName?: string
    /** 赠品是否是商品 0-活动。1-商品，旧数据都是活动，新数据都是商品，参数不可改动 */
    giftRefType: 0 | 1
  }

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
    promotionDiscountsSkuVOList?: any[]
    couponListVOList?: any[]
    /** 活动列表 */
    activityList?: Marketing.ItemProps[]
    /** 活动对象 */
    promotionVO?: Marketing.ItemProps
    /** 接口返回的商品列表 */
    productListVOList?: Shop.ShopItemProps[]
  }
  interface ActivityListPayloadProps {
    name?: string
    startTime?: number
    endTime?: number
    createStartTime?: number
    createEndTime?: number
    page: number
    pageSize: number
    /** 活动类型，1-限时秒杀，2-今日拼团，3-礼包，4-激活码，5-地推专区，6-体验团长专区，7-采购专区，8-买赠 */
    type?: number
  }
  /** 满赠详情新增/修改传参属性 */
  interface FormDataProps {
    /** 活动名称 */
    title?: string
    /** 活动开始时间 */
    startTime?: number
    /** 活动结束时间 */
    endTime?: number
    /** 活动规则描述 */
    activityDescribe?: string
    /** 买赠活动主品引用类型(0:活动,1:商品) */
    mainRefType?: 0 | 1
    id?: number
    /** 赠品策略类型 0-循环规则，1-阶梯规则 */
    strategyType?: 0 | 1
    /** 选择活动 */
    activity?: PresentContentValueProps
    product?: PresentContentValueProps
    /** 循环规则 */
    loop?: PresentContentValueProps
    rank?: {
      /** 阶梯规则：0-不可叠加，1-可叠加 */
      ladderRule: 0 | 1
      ruleList: PresentContentValueProps[]
    }
    /** 目标用户 40-管理员, 30-合伙人, 20-区长, 10-团长, 2-普通用户老用户, 1-普通用户新用户 */
    userScope?: any[]
    /** 赠品是否是商品 0-活动。1-商品，旧数据都是活动，新数据都是商品，参数不可改动 */
    giftRefType: 0 | 1
  }
}