import { post } from '@/util/fetch'
export function getProductList (data) {
  return post('/product/list', data)
}
//买菜优惠券商品
export function getFreshProductList (data) {
  return post('/product/fresh/promotion/select/list', data)
}