import { status } from './config'

/** 适配分页查询楼层响应 */
export function queryFloorRespones (res: any) {
  res.records = Array.isArray(res.records) ? res.records.map((v: any) => {
    v.modifyTime = APP.fn.formatDate(v.modifyTime)
    v.statusText = status[v.status]
    return v
  }): []
  return res
}

/** 适配查询楼层详情响应 */
export function queryFloorDetailRespones (res: any) {
  res.modifyTime = APP.fn.formatDate(res.modifyTime)
  return res
}