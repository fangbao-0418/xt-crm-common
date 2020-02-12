import moment from 'moment';
import { listResponse } from './adapter';
import { exportFileStream } from '@/util/fetch';
const { newPost } = APP.http;

export interface Payload {
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
export function getPages(payload: Payload) {
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

// 商品导出
export function exportProduct(payload: Payload) {
  return exportFileStream('/product/basic/export', payload, '库存商品' + moment().format('YYYYMMDDHHmmss') + '.xlsx')
}
