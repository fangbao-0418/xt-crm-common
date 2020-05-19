/*
 * @Date: 2020-05-02 20:28:48
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-19 14:03:03
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/components/supplier-selector/api.ts
 */
const { post, get, newPost } = APP.http

/** 获取全部供应商列表 */
export function getAllStoreList (data: any, config?: any) {
  return post('/store/list', data, config)
}

/** 获取优选供应商列表 */
export function getYxStoreList (data: any, config?: any) {
  return post('/store/yx/list', data, config)
}
