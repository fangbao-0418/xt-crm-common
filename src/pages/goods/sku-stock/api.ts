import moment from 'moment';
import { listResponse, requestPayload, detailResponse } from './adapter';
import { exportFileStream, newPut } from '@/util/fetch';
import { SkuStockFormProps } from './form';
const { get, newPost } = APP.http;

export interface listPayload {
  barCode: string,
  categoryId: number,
  createEndTime: number,
  createStartTime: number,
  modifyEndTime: number,
  modifyStartTime: number,
  page: number,
  pageSize: number,
  productBasicId: number,
  productCode: string,
  productName: string,
  /** 状态 0-失效,1-正常,2-异常，3-售罄 */
  status: 0 | 1 | 2 | 3,
  storeId: number
}

// 获取库存管理列表
export function getPages(payload: listPayload) {
  return newPost('/product/basic/list', payload).then(listResponse);
}

// 批量生效
export function effectProduct(payload: { ids: number[] }) {
  return newPost('/product/basic/effect', payload);
}

// 批量失效
export function invalidProduct(payload: { ids: number[] }) {
  return newPost('/product/basic/invalid', payload);
}

// 库存商品导出
export function exportProduct(payload: listPayload) {
  return exportFileStream('/product/basic/export', payload, '库存商品' + moment().format('YYYYMMDDHHmmss') + '.xlsx')
}

// 新增库存商品
export function addProduct(payload: SkuStockFormProps) {
  console.log(requestPayload(payload), 'request payload -----------------------')
  return newPost('/product/basic/add', requestPayload(payload));
}

// 更新库存商品
export function updateProduct(payload: SkuStockFormProps) {
  return newPut('/product/basic/update', requestPayload(payload))
}

// 查询库存商品
export function getProduct() {
  return get('').then(detailResponse);
}