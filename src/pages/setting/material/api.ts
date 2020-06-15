const { get, newPost } = APP.http
/**
 * 获取素材列表
 */
export function setMaterialSetting (data: any) {
  return newPost('/mcweb/product/material/setting', data)
}

/** 获取用户信息 */
export const getMaterialSetting = () => {
  return get('/mcweb/product/material/getSetting')
}