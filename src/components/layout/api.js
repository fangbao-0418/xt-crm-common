/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-26 20:23:41
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/components/layout/api.js
 */
import * as Fetch from '@/util/fetch';

// 获取权限list
export function getMenuList(params) {
  return Fetch.post('/menu/list', params, {
    /** 禁止日志 */
    banLog: true
  });
}

// 角色详情
export function getRoleInfo(params) {
  return Fetch.post(
    `/permission/qryPermissions`,
    {},
    {
      data: params,
      banLog: true,
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
