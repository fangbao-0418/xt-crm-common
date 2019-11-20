import { get, put } from '@/util/app/http';

export function getProductListByMemberId(params) {
  return get('/product/member/list', params);
}

export function changeStockBySKUId(params) {
  return put('/product/member/sku/inventory', {}, { data: params, headers: {} });
}
