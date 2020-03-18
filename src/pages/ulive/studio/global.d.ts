/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-18 11:59:13
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/ulive/studio/global.d.ts
 */
/** 直播 */
declare namespace UliveStudio {
  interface ItemProps {
    anchorId: number
    /** 状态 (0-草稿, 10-预告:已提交未审核, 20-预告:未过审(审核失败), 30-预告:已过期, 40-预告:禁播,50-停播(运营停播), 51-停播（停播回放）, 60-已结束(主播关闭直播), 70-预告:待开播(审核成功), 80-即将开始(主播已进入直播间), 90-直播中) */
    liveStatus: 0 | 10 | 20 | 30 | 40 | 50 | 51 | 60 | 70 | 80 | 90
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
    /** 是否上下架(0-下架, 1-上架, 6-断网下架) */
    status: 0 | 1 | 6
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
    /** 官方封面 */
    liveBannerUrl: string
    /** 主播封面 */
    liveCoverUrl: string
    /** 审核原因 */
    auditReason: string
    /** 直播地址 */
    playUrl: string
    /** 举报数 */
    complainNum: number
    /** 主播身份 10-公司, 20-供应商, 30-网红主播, 40-买家 */
    anchorType: Anchor.AnchorIdentityType
    /** 停播原因 */
    stopReason: string
    memberId: number
    playbackUrl: string[]
    /** 0-普通主播, 10-星级主播 */
    anchorLevel: 0 | 10
    /** 直播标签 */
    liveTags: string[]
  }
  /** 直播计划详情 */
  interface StatisticsProps {
    /** 直播人气 */
    callOnPv: number
    /** 访问UV */
    callOnUv: number
    /** 点赞UV */
    giveThumbsUpUv: number
    /** 点赞PV */
    giveThumbsUpPv: number
    /** 立即下单UV */
    immediatelyBuyUv: number
    /** 订单实际支付订单总数 */
    orderActualPayTotal: number
    /** 订单实付总金额 */
    orderTotalPayMoney: number
    /** 直播时长 */
    totalTime: number
  }
  /** 举报信息 */
  interface ComplainProps {
    createTime: number
    /** 主播ID */
    anchorId: number
    /** 违规描述 */
    description: string
    /** 直播计划ID */
    livePlanId: number
    /** 主播用户ID */
    memberId: number
    /** 其他违规内容描述 */
    otherTypeContent: string
    /** 举报人联系方式 */
    phone: string
    /** 举报人用户ID */
    reportMemberId: number
    /** 举报人昵称 */
    reportNickname: string
    /** 截图url(多张以逗号分割) */
    screenshotsUrl: string
    /** 类型(0-讨论政治内容，10-暴力恐怖血腥, 20-色情,低俗, 30-赌博诈骗, 40-长时间无人直播, 50-头像, 封面内容侵权, 60-其他违规) */
    type: 0 | 10 | 20 | 30 | 40 | 50 | 60
  }
}