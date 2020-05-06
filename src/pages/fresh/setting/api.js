import * as Fetch from '@/util/fetch'

/**
 * 获取首页配置信息
 * @param {*} params
 */
export function getSetting (params) {
  return Fetch.get('/crm/home/fresh/style/get', params)
}

/**
 * 设置首页配置信息
 * @param {*} params
 */
export function setSetting (params) {
  return Fetch.newPost('/crm/home/fresh/style', params)
}
