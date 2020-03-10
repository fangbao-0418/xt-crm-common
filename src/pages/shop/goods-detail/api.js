import { post, get } from '@/util/fetch';

/** 获取商品详情信息 */
export function getGoodsInfo(data) {
  return post('/product/detail', data);
}

/** 获取运费模板信息 */
export function getFreightTemplate(id) {
  return get(`/template/${id}`);
}
