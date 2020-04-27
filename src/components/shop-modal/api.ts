/*
 * @Date: 2019-11-12 11:03:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-26 17:25:17
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/components/shop-modal/api.ts
 */
import { SearchPayload } from './index'
const { post } = APP.http
export function fetchShopList (payload: SearchPayload) {
  return post('/product/list', payload)
}