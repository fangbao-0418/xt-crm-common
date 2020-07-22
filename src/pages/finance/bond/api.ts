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
//保证金缴纳详情
export function getDetailInfo (payload: any) {
  return get('/mcweb/account/financial/supplier/deposit/detail/info/v1', payload)
}
//认领保证金
export function claim (payload: any) {
  return newPost('/mcweb/account/financial/supplier/deposit/detail/claim/v1', payload)
}