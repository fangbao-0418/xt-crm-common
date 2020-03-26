/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-26 18:14:16
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/auth/role/api.js
 */
import * as Fetch from '@/util/fetch';
var qs = require('qs');

// 获取权限list
export function getMenuList(params) {
  return Fetch.post('/menu/list', params, {
    /** 禁止日志 */
    banLog: true
  });
}

// 增加角色
export function addRole(params) {
  return Fetch.post('/role/add', params);
}

// 编辑角色
export function editRole(params) {
  return Fetch.post('/role/update', params);
}

// 角色列表

export function getRoleList(params) {
  return Fetch.post('/role/list', params);
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

// 为角色添加权限
export function addPermisson(params) {
  return Fetch.post('/permission/configPermission', params);
}
