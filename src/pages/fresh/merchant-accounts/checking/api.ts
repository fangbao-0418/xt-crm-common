/*
 * @Date: 2020-04-28 14:00:21
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-29 14:20:20
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/merchant-accounts/checking/api.ts
 */
const { newPost } = APP.http
export const fetchList = () => {
  return Promise.resolve({
    total: 0,
    records: []
  })
}
export const fetchDetailList = () => {
  return Promise.resolve({
    total: 0,
    records: []
  })
}