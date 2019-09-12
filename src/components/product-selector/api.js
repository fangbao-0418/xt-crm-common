import { post } from '@/util/fetch';
export function getProductList(data) {
  return post('/product/list', data);
}