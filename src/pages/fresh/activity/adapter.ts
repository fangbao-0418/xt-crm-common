/*
 * @Date: 2020-03-19 14:37:12
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-19 14:37:35
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/activity/adapter.ts
 */
import moment from 'moment'
import { initImgList } from '@/util/utils'

const replaceHttpUrl = (imgUrl: string) => {
  return imgUrl.replace('https://assets.hzxituan.com/', '').replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '')
}

// 过滤新建编辑活动入参
export function promotionParams(payload: {
  id: number,
  title: string,
  startTime: number,
  endTime: number,
  canUpdate: boolean,
  sort: number,
  type: number,
  tagUrl: {url: string}[],
  tagPosition: number,
  visibleAct: boolean
}) {
  const result: any = {
    ...payload,
    startTime: payload.startTime && payload.startTime.valueOf(),
    endTime: payload.endTime && payload.endTime.valueOf(),
    tagUrl: payload.tagUrl && payload.tagUrl[0] ? replaceHttpUrl(payload.tagUrl[0].url) : ''
  }
  delete result.time
  return result
}

// 过滤活动响应
export function promotionResponse(res: any) {
  res = res || {}
  res.startTime = res.startTime ? moment(res.startTime): null
  res.endTime = res.endTime ? moment(res.endTime): null
  res.tagUrl = initImgList(res.tagUrl)
  return res
}
