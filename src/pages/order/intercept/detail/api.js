import { get, post, request } from '@/util/app/http';

/**
 * 获取订单拦截用户列表
 * @param {object} param 
 */
export function getPrivilegeById(param) {
    return get('/member/interception/privilege', param);
}

/**
 * 关闭订单拦截权限根据用户Id
 * @param {object} param 
 */
export function closePrivilege(param) {
    return post(`/member/interception/revocation`, param);
}

/**
 * 开启订单拦截权限根据用户Id
 * @param {object} param 
 */
export function openPrivilege(param) {
    return post(`/member/interception/authorization`, param);
}

/**
 * 获取会员店铺售后地址根据会员Id
 * @param {*} param 
 */
export function getAddressByMemberId(param) {
    return get('/crm/shop/address/v1/default', param);
}


/**
 * 获取基础地址库(省市区列表)
 * @param {*} param 
 */
export function getBaseAddress(param) {
    return post('/address/list/3', param);
}

/**
 * 新增会员售后地址
 * @param {*} param 
 */
export function addAddressByMemberId(param) {
    return post('/crm/shop/address/v1/add', {}, { data: param, headers: {} });
}

/**
 * 更新会员售后地址
 * @param {*}} param 
 */
export function updateAddressByMemberId(param) {
    return request('/crm/shop/address/v1/update', { method: 'PATCH', data: param, headers: {} });
}