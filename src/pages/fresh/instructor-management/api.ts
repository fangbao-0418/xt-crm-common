/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable no-empty-pattern */
import { newPost } from '@/util/fetch'
import { omitBy } from 'lodash'
const { get, post } = APP.http
export interface listPayload {
  page: number,
  pageSize: number,
  phone: string,
}
// 获取列表
export function getPages (payload: any) {
  payload = omitBy(payload, value => value === '')
  return newPost('/shop/area/v1/page/instructor', payload)
}
// 删除
export function deleteInstructor (id:any) {
  return get(`/shop/area/v1/delete/instructor?id=${id}`)
}
// 新增编辑
export function addUpdateInstructor (payload: any) {
  return newPost('/shop/area/v1/modify/instructor', payload)
}
// 根据id查询
export function getShopDetail (id: string) {
  return get(`/shop/area/v1/query/instructor?id=${id}`)
}