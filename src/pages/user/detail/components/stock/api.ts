import { newPost } from '@/util/fetch'
import * as adapter from './adapter'

/** 查询用户团购会采购库存  */
export async function getPurchaseDetail (payload: {
  memberId: number,
  page: number,
  pageSize: number,
  productId?: number,
  productName?: string,
  pruchaseStartTime?: number,
  purchaseEndTime?: number
}) {
  const res = await newPost('/product/member/purchase/detail', payload)
  console.log('adapter getPurchaseDetail =>', adapter.purchaseDetailRespones(res))
  return adapter.purchaseDetailRespones(res)
}