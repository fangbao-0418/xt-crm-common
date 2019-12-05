import { queryString } from '@/util/utils'
import * as adapter from './adapter'
const { get, del, newPut, newPost } = APP.http
/** 抽奖活动列表分页接口 */
export function getPage (payload: {
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
  console.log('payload => ', payload)
  return get(`/luckydraw/getPage${queryString(payload)}`)
}

/** 抽奖活动详情接口 */
export async function getActivityDetail (luckyDrawId: number) {
  const res = await get(`/luckydraw/getDetail?luckyDrawId=${luckyDrawId}`)
  return adapter.activityResponse(res)
}

/** 抽奖活动场次详情接口 */
export function getSessionsDetail (luckyDrawRoundId: number) {
  return get(`/luckydraw/round/getDetail?luckyDrawRoundId=${luckyDrawRoundId}`)
}

/** 删除抽奖活动接口 */
export function deleteActivity (luckyDrawId: number) {
  return del('/luckydraw/delete', { luckyDrawId })
}

/** 删除抽奖活动场次接口 */
export function deleteSession (luckyDrawRoundId: number) {
  return del('/luckydraw/round/delete', { luckyDrawRoundId })
}

/** 修改抽奖活动接口 */
export function saveActivity (payload: Lottery.ActivityParams) {
  return newPost('/luckydraw/save', adapter.activityParams(payload))
}

/** 修改抽奖活动接口 */
export function updateActivity (payload: Lottery.ActivityParams) {
  return newPut('/luckydraw/update', adapter.activityParams(payload))
}
/** 保存抽奖活动场次接口 */
export function saveSession (payload: {
  luckyDrawId: number,
  title: string,
  startTime: number,
  endTime: number,
  awardList: Lottery.LuckyDrawAwardListVo[]
}) {
  return newPost('/luckydraw/round/save', payload)
}