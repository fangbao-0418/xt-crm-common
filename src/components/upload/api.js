import { get } from '../../util/fetch';
const { newPost } = APP.http

/**
 * 获取阿里云oss临时秘钥
 *
 * @export
 * @param {*} [data]
 * @returns
 */
export function getStsPolicy(data) {
  return get('/oss/stspolicy', data);
}

/**
 * 获取腾讯云con临时秘钥
 *
 * @export
 * @param {*} [data]
 * @returns
 */
export function getStsCos(data) {
  return get('/oss/cos/credential', data);
}

/**
 * 云点播定义获取上传签名的函数
 */
export function getSignature() {
  return newPost('/mcweb/octupus/upload/sign')
}