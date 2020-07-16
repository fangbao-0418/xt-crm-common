/*
 * @Date: 2019-11-12 11:03:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-26 17:25:17
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/components/shop-modal/api.ts
 */
import { SearchPayload } from './index'
const { post, get } = APP.http
export function fetchShopList (payload: SearchPayload) {
  return post('/product/list', payload)
}

// 获取店铺类型
export const getShopTypes = () => {
  return get('/shop/v1/query/type').then((res) => {
    return (res || []).map((item: { tag: any; code: any }) => {
      return {
        label: item.tag,
        value: item.code
      }
    })
  })
}