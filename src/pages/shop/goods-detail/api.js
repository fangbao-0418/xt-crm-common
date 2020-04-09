import { newPost, get } from '@/util/fetch';

/** 获取商品详情信息 */
export function getGoodsInfo(data) {
  return get('/shop/product/detail', data);
}

/** 获取运费模板信息 */
export function getFreightTemplate(id) {
  return get(`/template/${id}`);
}

/** 审核商品 */
export function auditGoods(data) {
  return newPost('/shop/product/audit', data);
}
