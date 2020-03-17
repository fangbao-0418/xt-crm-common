import { exportFile } from '@/util/fetch';
import { download } from '@/util/utils';
import { baseHost } from '@/util/baseHost';
const { post, newPost } = APP.http

// 获取店长列表数据
export function getBossList(params) {
  // const bossData = {
  //   total: 37,
  //   size: 10,
  //   current: 1,
  //   searchCount: true,
  //   pages: 4,
  //   records: [{
  //     id: 1,
  //     name: '昵称',
  //     phone: 15858275481,
  //     volume: 1,
  //     refund: 2,
  //     level: '14',
  //     saleCount: 10,
  //     violation: 7
  //   }]
  // }

  // return bossData
  return newPost('http://192.168.4.206:8080/shop/v1/managers/page', params);
}

// 查询用户
export function checkUser(params) {
  return post('http://192.168.4.206:8080/shop/v1/managers/check', params);
}

// 批量创建小店
export function createShop(params) {
  return post('http://192.168.4.206:8080/shop/v1/managers/create', params);
}

// 开通小店
export function openShop(params) {
  return newPost('http://192.168.4.206:8080/shop/v1/shop/open', params);
}

// 关闭小店
export function closeShop(params) {
  return newPost('http://192.168.4.206:8080/shop/v1/shop/close', params);
}

// 导出
export function batchExport(data) {
  // download(`${baseHost}/shop/export?phones=${data}`, '可开通小店情况表')
  return exportFile('http://192.168.4.206:8080/shop/export', data, '可开通小店情况表')
}


