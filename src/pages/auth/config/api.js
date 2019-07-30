import * as Fetch from '@/util/fetch';
var qs = require('qs');

// 所有菜单项
export function getList(params) {
    // return Fetch.request(`/menu/list?${qs.stringify(params)}`);
    return Fetch.post('/menu/list', params);
}

// 增加菜单项
export function addMenu(params) {
    return Fetch.post('/menu/add', params);
}

// 编辑菜单项
export function updateMenu(params) {
    return Fetch.post('/menu/update', params);
}

// 删除菜单
export function delMenu(params) {
    return Fetch.post('/menu/del', params);
}

// 菜单详情

export function getMenuInfo(params) {
    return Fetch.request(`/menu/info?${qs.stringify(params)}`);
}