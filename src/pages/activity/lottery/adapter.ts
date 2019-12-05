import moment from 'moment'
/** 转换新增编辑活动入参 */
export function activityParams (payload: Lottery.ActivityParams) {
  payload.startTime = moment(payload.startTime).valueOf()
  return payload
}

/** 转换新增编辑活动响应 */
export function activityResponse (res: any) {
  res.startTime = moment(res.startTime)
  console.log('res => ', res)
  return res || {}
}

/** 转换新增编辑场次入参 */
export function sessionParams (payload: Lottery.SessionsParams) {
  payload.startTime = moment(payload.startTime).valueOf()
  payload.endTime = moment(payload.endTime).valueOf()
  return payload
}