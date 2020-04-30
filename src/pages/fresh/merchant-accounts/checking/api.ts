/*
 * @Date: 2020-04-28 14:00:21
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-30 17:21:31
 * @FilePath: /supplier/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/merchant-accounts/checking/api.ts
 */
const { get, newPost } = APP.http
export const fetchList = (payload: any) => {
  return Promise.resolve({
    total: 0,
    records: []
  })
  return get('/fresh/account/statement/list', payload)
}
export const fetchDetail = (id: any) => {
  return Promise.resolve({
    total: 0,
    records: []
  })
  return get(`/fresh/account/statement/${id}`)
}