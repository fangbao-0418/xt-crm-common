import * as Fetch from '@/util/fetch';
//提现记录
export function getData(params) {
    return Fetch.post('/member/withdrawalList', params);
}

export function exportFile(data) {
    return Fetch.exportFile('/member/withdrawal/export', data);
  }