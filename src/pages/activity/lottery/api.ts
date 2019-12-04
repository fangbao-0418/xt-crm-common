import { get, del, newPost } from '@/util/fetch'
import { queryString } from '@/util/utils'
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
  return get(`/luckydraw/getPage${queryString}`)
}

/** 抽奖活动详情接口 */
export function getActivityDetail (luckyDrawId: number) {
  return get(`/luckydraw/getDetail?luckyDrawId=${luckyDrawId}`)
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

/** 保存抽奖活动接口 */
export function saveActivity (payload: {
  title: string,
  type: number,
  startTime: number,
  restrictWinningTimes: number,
  remark: string,
  roundList: Lottery.LuckyDrawRoundListVo[]
}) {
  return newPost('/luckydraw/save', payload)
}

/** 保存抽奖活动场次接口 */
export function saveSession (payload: {
  id: number,
  title: string,
  startTime: number,
  endTime: number,
  awardList: Lottery.LuckyDrawAwardListVo[]
}) {
  return newPost('/luckydraw/round/save', payload)
}