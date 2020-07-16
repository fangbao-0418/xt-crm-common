/*
 * @Date: 2020-03-27 11:00:32
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-03 10:30:22
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/finance/withdraw/api.ts
 */
import { listResponse, RecordsResponse } from './adapter'
import { exportFile } from '@/util/fetch'
import { queryString } from '@/util/utils'
const { get, newPost } = APP.http

interface RecordsPaylod {}
//保证金条目
export function getData (payload: any) {
  return newPost('/mcweb/account/financial/supplier/deposit/list/v1', payload)
}
//保证缴纳列表
export function getDetailDataList (payload: any) {
  return newPost('/mcweb/account/financial/supplier/deposit/detail/list/v1', payload)
}
