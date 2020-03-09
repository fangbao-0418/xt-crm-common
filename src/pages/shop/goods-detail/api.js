import { post } from '@/util/fetch';

export function getGoodsInfo(data) {
  return post('/product/detail', data);
}
