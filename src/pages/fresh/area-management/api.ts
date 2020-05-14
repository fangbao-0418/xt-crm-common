/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable no-empty-pattern */
import moment from 'moment'
import { newPost } from '@/util/fetch'
import { omitBy } from 'lodash'
const { get, post } = APP.http

import { listResponse, formRequest, formResponse } from './adapter'
export interface listPayload {
  page: number,
  pageSize: number,
  name: string,
  /** 状态 0-失效,1-正常,2-异常，3-售罄 */
  status: 0 | 1 | 2 | 3,
}

// 获取库存管理列表
export function getPages (payload: any) {
  payload = omitBy(payload, value => value === '')
  return newPost('/shop/area/v1/page/area', payload).then(listResponse)
}

// 批量生效
export function effectProduct (payload: { ids: number[] }) {
  return newPost('/product/basic/effect', payload)
}

// 批量失效
export function invalidProduct (payload: { ids: number[] }) {
  return newPost('/product/basic/invalid', payload)
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