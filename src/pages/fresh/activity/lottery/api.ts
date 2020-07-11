import { queryString } from '@/util/utils'
import * as adapter from './adapter'
const { get, del, newPut, newPost } = APP.http
/** 抽奖活动列表分页接口 */
export async function getPage (payload: {
  title: string,
  type: number,
  status: 0 | 1 | 2,
  startCreateTime: number,
  endCreateTime: number,
  startBeginTime: number,
  endBeginTime: number,
  page: number,
  pageSize: number
}) {
  const res = await get(`/mcweb/promotion/fresh/luckydraw/getPage${queryString(payload)}`)
  return adapter.listResponse(res)
}

/** 抽奖活动详情接口 */
export async function getActivityDetail (luckyDrawId: number) {
  const res = await get(`/mcweb/promotion/fresh/luckydraw/getDetail?luckyDrawId=${luckyDrawId}`)
  return adapter.activityResponse(res)
}

/** 删除抽奖活动接口 */
export function deleteActivity (luckyDrawId: number) {
  return del(`/mcweb/promotion/fresh/luckydraw/delete?luckyDrawId=${luckyDrawId}`)
}

/** 删除抽奖活动场次接口 */
export function deleteSession (luckyDrawRoundId: number) {
  return del(`/mcweb/promotion/fresh/luckydraw/round/delete?luckyDrawRoundId=${luckyDrawRoundId}`)
}

/** 修改抽奖活动接口 */
export function saveActivity (payload: Lottery.ActivityParams) {
  return newPost('/mcweb/promotion/fresh/luckydraw/save', adapter.activityParams(payload))
}

/** 修改抽奖活动接口 */
export function updateActivity (payload: Lottery.ActivityParams) {
  return newPut('/mcweb/promotion/fresh/luckydraw/update', adapter.activityParams(payload))
}

/** 保存抽奖活动场次接口 */
export function saveSession (payload: {
  luckyDrawId: number,
  title: string,
  startTime: number,
  endTime: number,
  awardList?: Lottery.LuckyDrawAwardListVo[]
}) {
  return newPost('/mcweb/promotion/fresh/luckydraw/round/save', adapter.sessionParams(payload))
}

/** 修改抽奖活动场次接口 */
export function updateSession (payload: {
  id: number,
  luckyDrawId: number,
  title: string,
  startTime: number,
  endTime: number,
  awardList?: Lottery.LuckyDrawAwardListVo[]
}) {
  return newPut('/mcweb/promotion/fresh/luckydraw/round/update', adapter.sessionParams(payload))
}

/** 抽奖活动场次详情接口 */
export async function getSessionsDetail (luckyDrawRoundId: number) {
  const result = await get(`/mcweb/promotion/fresh/luckydraw/round/getDetail?luckyDrawRoundId=${luckyDrawRoundId}`)
  return adapter.sessionResponse(result)
}

/** 修改抽奖活动场次状态接口 */
export function updateSessionsStatus (payload: {
  luckyDrawRoundId: number,
  /** 1是开启，0是关闭 */
  open: 1 | 0
}) {
  return newPost('/mcweb/promotion/fresh/luckydraw/round/updateStatus', payload)
}

/** 修改抽奖活动状态接口 */
export function updateActivityStatus (payload: {
  luckyDrawId: number,
  /** 1是开启，0是关闭 */
  open: 1 | 0
}) {
  return newPost('/mcweb/promotion/fresh/luckydraw/updateStatus', payload)
}