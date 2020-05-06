import * as Fetch from '@/util/fetch'

/**
 * 获取首页配置信息
 * @param {*} params
 */
export function getSetting (params) {
  return Fetch.get('/cweb/fresh/home/style', params)
}

/**
 * 设置首页配置信息
 * @param {*} params
 */
export function setSetting (params) {
  return Fetch.post('/crm/fresh/home/style', params)
}
