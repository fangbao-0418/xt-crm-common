import { post } from '@/util/app/http';

/**
 * 获取订单拦截用户列表
 * @param {object} param
 */
export function getUserList(param) {
  return post('/member/interception/list', {}, { data: param, headers: {} });
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
 * 批量开启订单拦截权限根据用户Ids
 * @param {object} param
 */
export function batch0penPrivilege(param) {
  return post(`/member/interception/batchAuthorization`, {}, { data: param, headers: {} });
}

/**
 * 批量关闭订单拦截权限根据用户Ids
 * @param {object} param
 */
export function batchClosePrivilege(param) {
  return post(`/member/interception/batchRevocation`, {}, { data: param, headers: {} });
}

/**
 * 获取用户权限等级设置
 * @param {object} param
 */
export function getPrivilegeByLevel(param) {
  return post(`/member/interception/getInterception`, param);
}

/**
 * 设置用户权限等级设置
 * @param {object} param
 */
export function setPrivilegeByLevel(param) {
  return post(`/member/interception/setting`, {}, { data: param, headers: {} });
}
