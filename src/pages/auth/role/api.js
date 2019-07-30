import * as Fetch from '@/util/fetch';
var qs = require('qs');

// 获取权限list
// export function getMenuList(params) {
//     return Fetch.request(`/menu/list?${qs.stringify(params)}`);
// }

// 获取权限list
export function getMenuList(params) {
    return Fetch.post('/menu/list', params);
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
    // return Fetch.request(`/role/list?${qs.stringify(params)}`);
    return Fetch.post('/role/list', params);
}

// 角色详情

export function getRoleInfo(params) {
    return Fetch.request(`/permission/qryPermissions?${qs.stringify(params)}`);
}

// 为角色添加权限
export function addPermisson(params) {
    return Fetch.post('/permission/configPermission', params);
}