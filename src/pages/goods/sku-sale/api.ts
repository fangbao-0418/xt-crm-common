import { formRequest, baseProductResponse, baseProductPageResponse } from "./adapter";
import { queryString } from '@/util/utils';
const { newPost } = APP.http;

// 库存商品ID查询
export function getBaseProduct(id: string) {
  return newPost(`/product/basic/${id}`).then(baseProductResponse)
}

// 库存商品编码查询
export function getBaseBarcode(barCode: string) {
  return newPost(`/product/basic/bar_code?barCode=${barCode}`)
}

// 库存商品选择分页查询
export function getBaseProductPage(payload: {
  productBasicId: string,
  productName: string,
  //  0-失效,1-正常,2-异常，3-售罄
  status: 0 | 1 | 2 | 3,
  categoryId: string,
  page: number,
  pageSize: number
}) {
  const search = queryString(payload);
  return newPost(`/product/basic/select/page${search}`).then(baseProductPageResponse);
}

// 获取组合商品详情
export function getGroupProductDetail(productId: number) {
  return newPost(`/product/group/detail?productId=${productId}`)
}

// 新增组合商品
export function setGroupProduct(payload: any) {
  const isAdd = payload.productId;
  payload = formRequest(payload);
  return isAdd ? newPost('/product/group/add', payload) : newPost('/product/group/update', payload);
}