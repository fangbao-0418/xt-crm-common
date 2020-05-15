/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable no-empty-pattern */
import moment from 'moment'
import { newPost } from '@/util/fetch'
import { omitBy } from 'lodash'
const { get, post } = APP.http

export interface listPayload {
  page: number,
  pageSize: number,
  name: string,
}

// 获取列表
export function getPages (payload: any) {
  payload = omitBy(payload, value => value === '')
  return newPost('/shop/area/v1/page/area', payload)
}
// 批量失效
export function invalidProduct (payload: { ids: number[] }) {
  return newPost('/product/basic/invalid', payload)
}

// 新增编辑
export function addUpdateArea (payload: any) {
  return newPost('/shop/area/v1/modify/area', payload)
}
// 根据id查询
export function getDetail (id: string) {
  return get(`/shop/area/v1/query/area?id=${id}`)
}
// 获取使用中的三级城市
export function getDistricts () {
  return get('/shop/area/v1/using/districts')
}