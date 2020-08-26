const { get, newPost } = APP.http
import { prefix } from '@/util/utils'

interface RecordsPaylod {}
//保证金条目
export function getData (payload: any) {
  return newPost('/mcweb/account/financial/supplier/deposit/list/v1', payload)
}
//保证缴纳列表
export function getDetailDataList (payload: any) {
  return newPost('/mcweb/account/financial/supplier/deposit/detail/list/v1', payload)
}
//保证金缴纳详情
export function getDetailInfo (payload: any) {
  return get('/mcweb/account/financial/supplier/deposit/detail/info/v1', payload)
}
//认领保证金
export function claim (payload: any) {
  return newPost('/mcweb/account/financial/supplier/deposit/detail/claim/v1', payload)
}

//驳回保证金
export function reject (payload: any) {
  return get('/mcweb/account/financial/supplier/deposit/detail/reject/v1', payload)
}

//导出
export function exportData (payload: any) {
  return newPost('/mcweb/account/financial/supplier/deposit/apply/export/v1', payload)
}
//导入
export const importData = prefix('/mcweb/account/financial/supplier/deposit/apply/import/v1')