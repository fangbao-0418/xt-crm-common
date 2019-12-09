import moment from 'moment'
import { removeURLDomain, initImgList } from '@/util/utils'
import { typeConfig } from './config'
import { Decimal } from 'decimal.js'

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
    let awardValue: any = item.awardValue
    // 奖品类型是现金
    if (+item.awardType === 3) {
      awardValue = new Decimal(awardValue || 0).mul(100).toNumber()
    }
    item.restrictOrderAmount = new Decimal(item.restrictOrderAmount || 0).mul(100).toNumber()
    item.normalUserProbability = new Decimal(item.normalUserProbability || 0).mul(100).toNumber()
    item.headUserProbability = new Decimal(item.headUserProbability || 0).mul(100).toNumber()
    item.areaUserProbability = new Decimal(item.areaUserProbability || 0).mul(100).toNumber()
    item.cityUserProbability = new Decimal(item.cityUserProbability || 0).mul(100).toNumber()
    if ([1, 4].includes(+item.awardType)) {
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
  const awardList = (res.awardList || []).map((item: any) => {
    // 奖品类型是现金
    if (+item.awardType === 3) {
      item.awardValue = item.awardValue / 100
    }
    item.restrictOrderAmount = item.restrictOrderAmount / 100
    item.normalUserProbability = item.normalUserProbability / 100
    item.headUserProbability = item.headUserProbability / 100
    item.areaUserProbability = item.areaUserProbability / 100
    item.cityUserProbability = item.cityUserProbability / 100
    if ([1, 4].includes(+item.awardType)) {
      const [id, code] = (typeof item.awardValue === 'string') && item.awardValue.split(':')
      item.awardValue = {id, code, couponName: item.couponName}
    }
    item.awardPicUrl = initImgList(item.awardPicUrl)
    item.awardType = item.awardType || '0'
    return item
  })
  return { ...res, awardList }
}