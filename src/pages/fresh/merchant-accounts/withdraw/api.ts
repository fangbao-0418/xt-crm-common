/*
 * @Date: 2020-04-28 14:01:39
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-28 18:01:06
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/merchant-accounts/withdraw/api.ts
 */
const { get, newPost } = APP.http
export const fetchList = (payload: any) => {
  return get('/spm/supplier/cash/out/crm/page', 'GET', payload)
}
