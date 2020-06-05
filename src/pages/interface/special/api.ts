/*
 * @Date: 2020-05-05 15:21:07
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-18 15:36:07
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/interface/special/api.ts
 */
import { get, newPost, post, request } from '@/util/fetch'
import * as adapter from './adapter'

export function saveSpecial (payload: Special.DetailProps) {
  const data = adapter.saveSpecialParams(payload)
  return newPost('/crm/subject/save', data)
}

export function fetchSpecialList (data?: Special.SearchProps) {
  return get('/crm/subject/pageQuery', data)
}

/** 通过商品ids获取商品列表 */
export function fetchShopListByIds (ids: number[]) {
  return post('/product/listInIds', { ids })
}

/** 获取专题页详情内容 */
export async function fetchSpecialDetial (id: number) {
  const response = await get(`/mcweb/product/subject/detail?subjectId=${id}`)
  return adapter.specDetailResponse(response)
}

export function deleteSpecial (subjectIds: number[]) {
  return newPost('/crm/subject/delete', {
    ids: subjectIds
  })
}

export function changeSpecialStatus (subjectIds: number[], status: 0 | 1 | undefined) {
  return status === 1
    ? newPost('/crm/subject/inactive', {
      ids: subjectIds
    })
    : newPost('/crm/subject/active', {
      ids: subjectIds
    })
}

/**
 * 获取活动下所有商品
 * @param {*} param
 */
export function getGoodsListByActivityId (param: any) {
  const { promotionId, ...data } = param
  return get(`/promotion/products/byPromotionId?promotionId=${promotionId}`, data)
}

/**
 * 商品批量转移到另一个活动
 * @param {*} param
 */
export function batchMoveGoodsToOtherActivity (param: any) {
  return newPost('/promotion/batchmove', param)
}
