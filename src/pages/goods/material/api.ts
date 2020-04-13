/*
 * @Date: 2020-03-06 10:18:13
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-30 20:07:26
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/goods/api.js
 */

const { post, get, newPost, newPut } = APP.http
/**
 * 获取素材列表
 */
export function getMaterial (data: any) {
  return newPost('/product/material/query', data)
}

/** 获取用户信息 */
export const fetchUserInfo = (payload: {
  memberId?: number
  phone?: string
}) => {
  return get('/member/simple', payload)
}