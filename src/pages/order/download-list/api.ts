/*
 * @Date: 2020-05-05 21:05:49
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-06 10:29:25
 * @FilePath: /xt-crm/src/pages/fresh/merchant-accounts/download-list/api.ts
 */
const { get, newPost } = APP.http

/** 请求下载接口 */
export function getEarningsDetail (payload: any) {
  return newPost('::guard/exporter/task/list/v2', { ...payload, type: 104, system: 'crm' })
}