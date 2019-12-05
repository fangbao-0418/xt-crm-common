import moment from 'moment'
import { removeURLDomain, initImgList } from '@/util/utils'
/** 转换新增编辑活动入参 */
export function activityParams (payload: Lottery.ActivityParams) {
  payload.startTime = moment(payload.startTime).valueOf()
  return payload
}

/** 转换活动详情响应 */
export function activityResponse (res: any) {
  res.startTime = moment(res.startTime)
  console.log('res => ', res)
  return res || {}
}

/** 转换新增编辑场次入参 */
export function sessionParams (payload: Lottery.SessionsParams) {
  console.log('sessionParams => ', payload)
  payload.startTime = moment(payload.startTime).valueOf()
  payload.endTime = moment(payload.endTime).valueOf()
  payload.awardList = (payload.awardList || []).map((item: Lottery.LuckyDrawAwardListVo) => {
    const awardPicUrl = ((item.awardPicUrl || []) as any).map((v: any) => removeURLDomain(v.url)).join(',')
    if (item.awardType === 1) {
      const awardValue: any = item.awardValue || {}
      item.awardValue = awardValue.id + ':' + awardValue.code 
    }
    return {
      ...item,
      awardPicUrl
    }
  })
  return payload
}

/** 转换场次详情响应 */
export function sessionResponse (res: any) {
  res.startTime = moment(res.startTime)
  res.endTime = moment(res.endTime)
  const awardList = (res.awardList || []).map((v: any) => {
    return {
      ...v,
      awardPicUrl: initImgList(v.awardPicUrl)
    }
  })
  return { ...res, awardList } || { awardList: [] }
}