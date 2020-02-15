import * as Fetch from '@/util/fetch';

// 获取权限list
export function getMenuList(params) {
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

// 获取用户角色列表
export function getUserRoles(param) {
  return Fetch.get('/permission/qryUserRoles', param);
}

export function logout() {
  return Fetch.request('/logout');
}
