import { get } from '../../util/fetch';

/**
 * 获取阿里云oss临时秘钥
 *
 * @export
 * @param {*} data
 * @returns
 */
export function getStsPolicy(data) {
  return get('/oss/stspolicy', data);
}

/**
 * 获取腾讯云con临时秘钥
 *
 * @export
 * @param {*} data
 * @returns
 */
export function getStsCos(data) {
  return get('/oss/cos/credential', data);
}

