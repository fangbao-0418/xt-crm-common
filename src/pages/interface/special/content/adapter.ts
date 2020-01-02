import { status } from './config'
import { removeURLDomain } from '@/util/utils'

/** 保存专题内容请求 */
export function saveSubjectFloorParams (payload: any) {
  if (!Array.isArray(payload.list)) payload.list = []
  const result: any = {}
  result.list = payload.list.map((v: any) => {
    v.advertisementImgUrl = removeURLDomain(v.advertisementImgUrl)
    return v
  })
  return {
    ...payload,
    ...result
  }
}

/** 分页查询楼层响应 */
export function queryFloorRespones (res: any) {
  res.records = Array.isArray(res.records) ? res.records.map((v: any) => {
    v.modifyTime = APP.fn.formatDate(v.modifyTime)
    v.statusText = status[v.status]
    return v
  }): []
  return res
}

/** 条件查询楼层信息 */
export function subjectFloorDetailResponse (res: any) {
  res.modifyTimeText = APP.fn.formatDate(res.modifyTime)
  if (!Array.isArray(res.list)) res.list = []
  res.list = res.list.map((v: any) => {
    if (!Array.isArray(v.products)) v.products = []
    if (!Array.isArray(v.coupons)) v.coupons = []
    return v
  })
  return res
}