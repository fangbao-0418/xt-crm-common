/*
 * @Date: 2020-03-24 10:28:23
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-26 18:16:47
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/components/suppiler-auto-select/api.js
 */
import { post } from '@/util/fetch';

export function getStoreList(data) {
  return post('/store/list', data, {
    /** 禁止日志 */
    banLog: true
  })
}

export function getFreshList(data) {
  return post('/store/fresh/list', data)
}