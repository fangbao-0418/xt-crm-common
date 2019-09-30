declare namespace Marketing {
  /** 赠品内容value属性 */
  interface PresentContentValueProps {
    type: 0 | 1
    chooseCount: number
    couponList: Shop.CouponProps[]
    skuList: Shop.SkuProps[]
    spuIds: {[spuId: number]: number[]}
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
    /** 循环规则 */
    loop: {
      spuIds: {[spuId: number]: number[]}
      giftSkuJson: string
      type: 0 | 1
      couponList: Shop.CouponProps[]
    }
  }
}