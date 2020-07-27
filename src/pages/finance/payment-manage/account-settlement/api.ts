const { post, get, newPost, newPut, del } = APP.http

//账务对象校验
export const checkSubject = (payload: any) => {
  return get('/mcweb/account/financial/disposable/settlement/subject/check/v1', payload)
}
//一次性账务结算列表
export const getList = (payload: any) => {
  return newPost('/mcweb/account/financial/disposable/settlement/list/v1', payload)
}
/** 创建账务结算单 */
export const add = (payload: any) => {
  return newPost('/mcweb/account/financial/disposable/settlement/apply/v1', payload)
}
/** 账务结算单详情 */
export const getDetail = (id: any) => {
  return get('/mcweb/account/financial/disposable/settlement/detail/v1', { id })
}
/** 审核账务结算单 */
export const audit = (payload: any) => {
  return newPost('/mcweb/account/financial/disposable/settlement/audit/v1', payload)
}