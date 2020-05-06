/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-26 16:16:43
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/pages/interface/special/content/api.ts
 */
import * as adapter from './adapter'
const { get, newPut, newPost } = APP.http

/** 分页查询 */
export async function queryFloor (payload: {
  page: number,
  pageSize: number,
  endModifyTime?: number,
  floorName?: string,
  operator?: string,
  startModifyTime?: number,
  status?: 0 | 1
}) {
  const result = await newPost('/crm/subject/floor/query', payload)
  return adapter.queryFloorRespones(result)
}

/** 查询详情 */
export async function queryFloorDetail (floorId: number) {
  const res = await get(`/mcweb/product/subject_floor/detail?floorId=${floorId}`) || {}
  return adapter.subjectFloorDetailResponse(res)
}

/** 启用、停用 */
export function updateStatus (floorId: number) {
  return newPut(`/mcweb/product/subject_floor/setStatus?floorId=${floorId}`)
}

/** 保存楼层信息 */
export async function saveSubjectFloor (payload: {
  floorName: string,
  id?: number,
  list?: any[],
  modifyTime?: number,
  operator?: string,
  status: 1 | 0
}) {
  return newPost('/crm/subject/floor/save', adapter.saveSubjectFloorParams(payload))
}

/**
 * 获取活动下所有商品
 * @param {*} param
 */
export function getGoodsListByActivityId (param: any) {
  const { promotionId, ...data } = param
  return get(`/promotion/${promotionId}/products`, data)
}