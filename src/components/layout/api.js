import * as Fetch from '@/util/fetch';
var qs = require('qs');

// 获取权限list
export function getMenuList(params) {
  // return Fetch.request(`/menu/list?${qs.stringify(params)}`);
  return Fetch.post('/menu/list', params);
}

// 角色详情

export function getRoleInfo(params) {
  return Fetch.post(
    `/permission/qryPermissions`,
    {},
    {
      data: params,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    }
  );
}

export function logout() {
  return Fetch.request('/logout');
}
