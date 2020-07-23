/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-09 13:21:15
 * @FilePath: /xt-crm/src/pages/ulive/studio/api.ts
 */
import { Payload, formRequest } from './adapter'
const { post, get, newPost, newPut } = APP.http

/**
 * 邀请榜单设置
 * @param payload
 * @param payload.isOpen 0 关闭 1 开启
 * @param payload.shareBackground 分享背景
 * @param payload.shareInstructions 活动说明
 * @param payload.shareIcon 转发按钮
 * @param payload.livePlanId 直播计划id
 */
export const setShareConfig = (payload: Payload) => {
  return post('/live/share/config', formRequest(payload))
}

/**
 * 邀请榜单设置查看
 */
export const getShareDetail = (livePlanId: number) => {
  return get(`/live/share/detail?livePlanId=${livePlanId}`)
}

/** 直播列表 */
export const getStudioList = (payload: any) => {
  return get('::ulive/live/plan/list', payload)
}

/** 获取直播计划详情 */
export const fetchPlanInfo = (planId: any) => {
  return get<UliveStudio.ItemProps>(`::ulive/live/plan/${planId}`)
}

/** 停播 */
export const stopPlay = (payload: {
  breakReason: string
  /** 是否拉黑主播(0-不拉黑, 1-拉黑) */
  isBlock: 0 | 1
  planId: number
}) => {
  return newPut('::ulive/live/plan/break', payload)
}

/** 上下架 */
export const changeStatus = (payload: {
  planId: number
  status: 0 | 1
}) => {
  return newPut('::ulive/live/plan/status/update', payload)
}

/** 置顶 */
export const setTop = (payload: {
  planId: number
  /** 0-不置顶, 1-置顶) */
  isTop: 0 | 1
  topSort?: number
}) => {
  return newPut('::ulive/live/plan/top', payload)
}

/** 修改封面 */
export const changeCover = (payload: {
  planId: number
  bannerUrl: string
}) => {
  return newPut('::ulive/live/plan/banner', payload)
}

/** 审核 */
export const audit = (payload: {
  /** 审核原因，审核不通过必填 */
  auditReason?: string
  /** 审核状态(0-审核未通过, 1-审核通过) */
  auditStatus: 0 | 1
  planId: number
}) => {
  return newPut('::ulive/live/plan/audit', payload)
}

/** 获取小程序微信太阳码 */
export const getWxQrcode = (payload: {
  host?: string
  linkUrl?: string
  page: string
  scene: string
}) => {
  return newPost('::ulive/live/plan/code', payload)
}

/** 获取举报列表 */
export const fetchComplainList = (payload: {
  livePlanId: any
  pageSize: number
  page: number
}) => {
  return get('::ulive/live/complain/list', payload)
}

/** 直播场次批量审核 */
export const multiAudit = (payload: {
  /** 0-审核未通过, 1-审核通过 */
  auditStatus: 0 | 1
  planIds: any[]
  auditReason?: string
}) => {
  return newPost('::ulive/live/plan/batch/audit', payload)
}

/** 删除直播回放 */
export const stopPlayback = (payload: {
  planId: any
  forbidReason?: string
}) => {
  return newPost('::ulive/live/plan/playback/forbid', payload)
}

/** 优惠券列表 */
export const getCouponList = (payload: any) => {
  return newPost('/mcweb/coupon/get/couponList', payload)
}

/** 设置优惠券 */
export const setCoupon = (payload: any) => {
  return newPost('::ulive/live/coupon/modify', payload)
}
