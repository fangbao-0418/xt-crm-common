import * as Fetch from '@/util/fetch';
const { newPost } = APP.http;

//提现记录
export function getData(params) {
  return Fetch.post('/member/withdrawalList', params);
}

export function exportFile(data) {
  return Fetch.exportFile('/member/withdrawal/export', data);
}

/** 异步导出 */
export function exportAsync (data) {
  return newPost('/mcweb/account/financial/withdrawal/export/v1', data)
}