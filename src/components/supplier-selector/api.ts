/*
 * @Date: 2020-05-02 20:28:48
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-02 20:29:24
 * @FilePath: /supplier/Users/fangbao/Documents/xituan/xt-crm/src/components/supplier-selector/api.ts
 */
const { post, get, newPost } = APP.http
export function getStoreList (data: any, config?: any) {
  return post('/store/list', data, config)
}
