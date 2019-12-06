import moment from 'moment'
import { removeURLDomain, initImgList } from '@/util/utils'
import { typeConfig } from './config'

/** 转换活动列表响应 */
export function listResponse (res: any) {
  let { records } = res
  if (!Array.isArray(records)) records = []
  records = records.map((item: Lottery.ListProps) => {
    item.type = typeConfig[item.type]
    return item
  })
  return { ...res, records }
}

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
    let awardValue = item.awardValue
    if (item.awardType === 1) {
      const {id, code}: any = item.awardValue || {}
      awardValue = id + ':' + code 
    }
    return {
      ...item,
      awardValue,
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