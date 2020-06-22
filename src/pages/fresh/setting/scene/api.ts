const { get, newPost, newPut } = APP.http

/**
 * 创建场景
 * @param {*} params
 */
export function addScene (payload: any) {
  return newPost('/mcweb/product/category_menu/add', payload)
}

/**
 * 修改场景
 * @param {*} params
 */
export function updateScene (payload: any) {
  return newPut('/mcweb/product/category_menu/update', payload)
}

/**
 * 获取场景列表
 */
export function fetchSceneList () {
  return get('/mcweb/product/category_menu/fresh_scene', {
    page: 1,
    pageSize: 30
  })
}

/**
 * 获取场景详情
 */
export function fetchSceneDetail (id: any) {
  return get(`/mcweb/product/category_menu/detail?categoryMenuId=${id}`)
}