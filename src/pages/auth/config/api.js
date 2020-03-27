/*
 * @Date: 2019-11-12 11:03:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-26 18:14:03
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/auth/config/api.js
 */
import * as Fetch from '@/util/fetch';
var qs = require('qs');

// 所有菜单项
export function getList(params) {
    // return Fetch.request(`/menu/list?${qs.stringify(params)}`);
    return Fetch.post('/menu/list', params, {
        /** 禁止日志 */
        banLog: true
    });
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