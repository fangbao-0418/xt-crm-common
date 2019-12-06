import { post } from '@/util/fetch';

export function getGoodsInfo(data: any = {}) {
  return post('/product/detail', data);
}
