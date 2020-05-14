/*
 * @Date: 2020-03-24 10:28:23
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-14 17:05:58
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/components/suppiler-auto-select/api.js
 */
import { post } from '@/util/fetch'

export function getStoreList (data) {
  return post('/store/list', data, {
    /** 禁止日志 */
    banLog: true
  })
}

export function getFreshList (data) {
  return post('/store/fresh/list', data)
}