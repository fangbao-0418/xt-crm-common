import { listResponse, formRequest } from './adapter';
import { newPost } from '@/util/fetch';
import { queryString } from '@/util/utils';

const { get } = APP.http;
// 店铺列表
export async function getShopList() {
  return { records: [
    { status: 2 },
    { status: 3 }
  ] }
  // return get('/shop/list').then(listResponse)
}


// 新增店铺
export function addShop(payload: any) {
  payload = formRequest(payload);
  return newPost('/shop/add', payload);
}

// 编辑店铺
export function updateShop(payload: any) {
  payload = formRequest(payload);
  return newPost('/shop/update', payload);
}

// 根据id查询店铺
export function getShopDetail(shopId: number) {
  return get(`/shop/getById?shopId=${shopId}`)
}

// 店铺开关
export function onOrOffShop(payload: {
  shopId: number,
  status: 2 | 3
}) {
  const search = queryString(payload);
  return get(`/shop/onOrOff${search}`)
}