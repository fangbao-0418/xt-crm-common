const { post, get, newPost, newPut, del } = APP.http
//查询供应商
export const supplierBalance = (payload: any) => {
  return get('/mcweb/account/balance/supplierBalance', payload)
}