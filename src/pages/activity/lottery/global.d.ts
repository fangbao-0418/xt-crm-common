declare module Lottery {
  export interface ListProps {
    id: number
    title: string
    type: number
    createTime: number
    startTime: number
    endTime: number
    participationTimes: number
    /** 0：未开始，1：进行中，2：已结束，3：已关闭 */
    status: 0 | 1 | 2 | 3
  }
  export interface LuckyDrawRoundListVo {
    /** 场次id */
    id: number
    /** 场次名称 */
    name: string
    /** 参与人次 */
    participationTimes: number
    /** 开始时间 */
    startTime: number
    /** 结束时间 */
    endTime: number
    /** 状态，0：未开始，1：进行中，2：已结束，3：已关闭 */
    status: 0 | 1 | 2 | 3
  }
  export interface LuckyDrawAwardListVo {
    /** 奖品id */
    id: number
    /** 奖品类型 */
    awardType: number
    /** 奖品设置 */
    awardValue: string
    /** 简称 */
    awardTitle: string
    /** 图片 */
    awardPicUrl: string
    /** 风控级别 */
    controlLevel: number
    /** 奖品库存 */
    awardNum: number
    /** 发出数量 */
    receiveNum: number
    /** 单人限领 */
    restrictNum: number
    /** 订单门槛 */
    restrictOrderAmount: number
    /** 普通用户概率 */
    normalUserProbability: number
    /** 团长概率 */
    headUserProbability: number
    /** 区长概率 */
    areaUserProbability: number
    /** 合伙人概率 */
    cityUserProbability: number
  }
}