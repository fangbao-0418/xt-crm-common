/** 直播 */
declare namespace UliveStudio {
  interface ItemProps {
    anchorId: number
    /** 状态 (0-草稿, 10-预告:已提交未审核, 20-预告:未过审(审核失败), 30-预告:已过期, 40-预告:禁播,50-停播(运营停播), 60-已结束(主播关闭直播), 70-预告:待开播(审核成功), 80-即将开始(主播已进入直播间), 90-直播中) */
    liveStatus: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90
    /** 直播时间 */
    liveTime: number
    /** 直播标题 */
    liveTitle: string
    /** 直播置顶(0-未置顶，1-置顶, 2-官方置顶) */
    liveTop: 0 | 1 | 2
    /** 直播计划ID */
    planId: number
    /** 直播地址 */
    playUrl: string
    /** 是否上下架(0-下架, 1-上架) */
    status: 0 | 1
    /** 直播类型 0-公开直播，10-私密直播 */
    type: number
    liveData: StatisticsProps
    /** 主播昵称 */
    anchorNickName: string
    /** 主播手机号 */
    anchorPhone: string
    /** 预计直播开始时间 */
    liveAnticipatedStartTime: number
    /** 实际直播开始时间 */
    liveStartTime: number
    /** 直播结束时间 */
    liveEndTime: number
    /** 封面 */
    liveBannerUrl: string
    /** 审核原因 */
    auditReason: string
    /** 直播地址 */
    playUrl: string
  }
  /** 直播计划详情 */
  interface StatisticsProps {
    /** 直播人气 */
    callOnPv: number
    /** 访问UV */
    callOnUv: number
    /** 点赞UV */
    giveThumbsUpUv: number
    /** 立即下单UV */
    immediatelyBuyUv: number
    /** 订单实际支付订单总数 */
    orderActualPayTotal: number
    /** 订单实付总金额 */
    orderTotalPayMoney: number
    /** 直播时长 */
    totalTime: number
  }
}