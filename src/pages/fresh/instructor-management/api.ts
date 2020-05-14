/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable no-empty-pattern */
import { newPost } from '@/util/fetch'
import { omitBy } from 'lodash'
const { get, post } = APP.http

import {  formRequest, formResponse } from './adapter'
export interface listPayload {
  page: number,
  pageSize: number,
  phone: string,
}

// 获取列表
export function getPages (payload: any) {
  payload = omitBy(payload, value => value === '')
  return newPost('/product/basic/list', payload)
}

// 删除
export function invalidProduct (payload: { ids: number[] }) {
  return newPost('/product/basic/invalid', payload)
}

// 新增
export function addShop (payload: any) {
  payload = formRequest(payload)
  return newPost('/point/add', payload)
}

// 编辑
export function updateShop (payload: any) {
  payload = formRequest(payload)
  return newPost('/point/update', payload)
}

// 根据id查询
export function getShopDetail (shopId: string) {
  return get(`/point/getById?shopId=${shopId}`).then(formResponse)
}