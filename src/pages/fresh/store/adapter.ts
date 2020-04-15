/*
 * @Date: 2020-03-27 11:00:32
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-15 13:46:30
 * @FilePath: /supplier/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/store/adapter.ts
 */
import { omit } from 'lodash'
import { filterUploadFile } from '@/util/format'

// 过滤列表响应
export function listResponse (res: any) {
  res.records = (res.result || []).map((record: any) => {
    record.statusText = record.statusDesc
    record.typeText = record.typeDesc
    record.createTimeText = APP.fn.formatDate(record.createTime)
    record.applyTimeText = APP.fn.formatDate(record.applyTime)
    return record
  })
  return omit(res, 'result')
}

// 过滤表单请求
export function formRequest (payload: any) {
  const result: any = filterUploadFile(payload, 'req', ['pictrueUrl'])
  // 省市区
  const [provinceCode, cityCode, areaCode] = payload.address
  result.provinceCode = provinceCode
  result.cityCode = cityCode
  result.areaCode = areaCode

  return omit({ ...payload, ...result }, 'address')
}

// 过滤表单响应
export function formResponse (res: any) {
  const result: any = filterUploadFile(res, 'res', ['pictrueUrl'])
  console.log('formResponse =>', result)
  result.address = [res.provinceCode, res.cityCode, res.areaCode]
  return omit({ ...res, ...result }, ['provinceCode', 'cityCode', 'areaCode'])
}