const { get, newPost } = APP.http

/**
 * 获取首页配置信息
 * @param {*} params
 */
export function getSetting (params) {
  return get('/crm/home/fresh/style/get', params)
}

/**
 * 设置首页配置信息
 * @param {*} params
 */
export function setSetting (params) {
  return newPost('/crm/home/fresh/style', params)
}
