import { exportFile } from '@/util/fetch';
const { post, newPost } = APP.http

// 获取店长列表数据
export function getBossList(params) {
  return newPost('/shop/v1/managers/page', params);
}

// 查询用户
export function checkUser(params) {
  return post('/shop/v1/managers/check', params);
}

// 批量创建小店
export function createShop(params) {
  return post('/shop/v1/managers/create', params);
}

// 开通小店
export function openShop(params) {
  return newPost('/shop/v1/shop/open', params);
}

// 关闭小店
export function closeShop(params) {
  return newPost('/shop/v1/shop/close', params);
}

// 导出
export function batchExport(data) {
  return exportFile('/shop/export', data, '可开通小店情况表')
}


