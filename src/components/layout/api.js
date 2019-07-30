import * as Fetch from '@/util/fetch';
var qs = require('qs');

// 获取权限list
export function getMenuList(params) {
    // return Fetch.request(`/menu/list?${qs.stringify(params)}`);
    return Fetch.post('/menu/list', params);
}

// 角色详情

export function getRoleInfo(params) {
    return Fetch.request(`/permission/qryPermissions?${qs.stringify(params)}`);
}


export function logout() {
    return Fetch.request('/logout');
}