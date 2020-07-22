/*
 * @Date: 2019-11-12 11:03:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-26 18:13:35
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/login/api.js
 */
import * as Fetch from '@/util/fetch'

export function login (params) {
  return Fetch.post('/login', params, {
    /** 禁止日志 */
    banLog: true
  })
}