import { listResponse } from './adapter';
const { get, newPost } = APP.http;

// 获取库存管理列表
export function getPages() {
  return get('').then(listResponse);
}

// 修改粗存商品状态
export function updateStatus(payload: any) {
  return newPost('', payload)
}

// 批量导出
export function batchExport(payload: any) {
  return get('', payload)
}