const { post, get, newPost, newPut, del } = APP.http
export const getAnchorList = (payload: any) => {
  return get('::ulive/live/anchor/list', payload)
}

/** 获取外部账务流水 */
export const fetchList = (payload: any) => {
  return get('/mcweb/account/financial/disposable/out/flow/list/v1', payload)
}