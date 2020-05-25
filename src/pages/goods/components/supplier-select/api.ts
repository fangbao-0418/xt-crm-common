/*
 * @Date: 2020-05-12 17:42:44
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-12 17:44:42
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/goods/components/supplier-select/api.ts
 */
const { post, get, newPost } = APP.http
export function getStoreList (data: { name: string, pageSize: number }, config: any) {
  return post('/store/yx/list', data, config)
}