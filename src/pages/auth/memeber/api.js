import * as Fetch from '@/util/fetch';
var qs = require('qs');
// 角色列表
export function getRoleList(params) {
    // return Fetch.request(`/role/list?${qs.stringify(params)}`);
    return Fetch.post('/role/list', params);
}

// 用户列表
// export function getUserList(params) {
//     return Fetch.request(`/user/list?${qs.stringify(params)}`);
// }

export function getUserList(params) {
    return Fetch.post('/user/list', params);
}

// 用户详情
export function getUserInfo(params) {
    return Fetch.request(`/user/info?${qs.stringify(params)}`);
}

///permission/configUserRole
// 用户绑定角色
export function configUserRole(params) {
    return Fetch.post('/permission/configUserRole', params);
}

// 添加用户
export function addUser(params) {
    return Fetch.post('/user/add', params);
}

// 编辑用户
export function editUser(params) {
    return Fetch.post('/user/update', params);
}

// 用户绑定角色
export function addPermission(params) {
    return Fetch.post('/permission/configUserRole', params);
}