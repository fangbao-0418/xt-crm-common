import { newPost } from '@/util/fetch'
import * as adapter from './adapter'

/** 查询用户团购会采购库存  */
export async function getPurchaseList (payload: {
  memberId: number,
  page: number,
  pageSize: number,
  productId?: number,
  productName?: string,
  pruchaseStartTime?: number,
  purchaseEndTime?: number
}) {
  const res = await newPost('/product/member/purchase/list', payload)
  console.log('adapter getPurchaseList =>', adapter.purchaseListRespones(res))
  return adapter.purchaseListRespones(res)
}

/** 用户团购会采购库存核销 */
export async function eliminate (payload: {
  eliminateCount: number,
  purchaseId: number
}) {
  return newPost('/product/member/purchase/eliminate', payload)
}