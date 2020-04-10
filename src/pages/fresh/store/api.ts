/*
 * @Date: 2020-03-27 11:00:32
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-10 18:15:09
 * @FilePath: /xt-crm/src/pages/fresh/store/api.ts
 */
import { listResponse, formRequest, formResponse } from './adapter'
import { newPost } from '@/util/fetch'
import { queryString } from '@/util/utils'

const { get } = APP.http

// 店铺列表
export async function getShopList (payload: any) {
  const search = queryString(payload)
  return get(`/point/list${search}`).then(listResponse)
}

// 新增店铺
export function addShop (payload: any) {
  payload = formRequest(payload)
  return newPost('/point/add', payload)
}

// 编辑店铺
export function updateShop (payload: any) {
  payload = formRequest(payload)
  return newPost('/point/update', payload)
}

// 根据id查询店铺
export function getShopDetail (shopId: string) {
  return get(`/point/getById?shopId=${shopId}`).then(formResponse)
}

// 店铺开关
export function onOrOffShop (payload: {
  shopId: number,
  status: 2 | 3
}) {
  return newPost('/point/onOrOff', payload)
}

// getTypeEnum()
export function getTypeEnum () {
  return get('/point/typeList')
}
