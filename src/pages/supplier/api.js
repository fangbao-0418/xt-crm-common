import { exportFile } from '../../util/fetch';
const { post, get } = APP.http
const debug = false;

const mockData = {
  current: 0,
  pages: 0,
  records: [
    {
      code: 'string',
      contacts: 'string',
      email: 'string',
      id: 0,
      name: 'string',
      phone: 'string',
      shortName: 'string',
    },
  ],
  searchCount: true,
  size: 0,
  total: 0,
};

// 新增供应商账号
export function addSupplierAccount(data) {
  return post('/store/add/supplier', data)
}

// 重置供应商账号
export function resetStore(data) {
  return post('/store/reset', data)
}
export function querySupplierList(data) {
  console.log('querySupplierList- params', data, new Date());
  if (debug) {
    return Promise.resolve(mockData);
  }
  return post('/store/list', data);
}

export function getSupplierDetail(data) {
  console.log('getSupplierDetail- params', data, new Date());
  if (debug) {
    return Promise.resolve({
      address: 'string',
      code: 'string',
      consigneeAddress: 'string',
      contacts: 'string',
      email: 'string',
      id: 0,
      jumpUrl: 'string',
      name: 'string',
      phone: 'string',
      shortName: 'string',
    });
  }
  return get('/store/detail', data);
}

export function addSupplier(data) {
  console.log('addSupplier- params', data, new Date());
  if (debug) {
    return Promise.resolve(true);
  }
  return post('/store/add', data);
}

export function updateSupplier(data) {
  console.log('updateSupplier- params', data, new Date());
  if (debug) {
    return Promise.resolve(true);
  }
  return post('/store/update', data);
}

export function exportSupplier(data) {
  console.log('exportSupplier- params', data, new Date());
  if (debug) {
    return Promise.resolve(true);
  }
  return exportFile('/store/export', data);
}
