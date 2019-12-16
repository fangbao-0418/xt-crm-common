import { newPost } from '@/util/fetch'

/** 查询用户团购会采购库存  */
export function getPurchaseDetail (payload: {
  memberId: number,
  pageNo: number,
  pageSize: number,
  productId: number,
  productName: string,
  pruchaseStartTime: number,
  purchaseEndTime: number
}) {
  return newPost('/product/member/purchase/detail', payload)
}