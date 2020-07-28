const { get, newPost } = APP.http

/* 获取类目接口 */
export function fetchCategory (payload: any) {
  // level 1-只查一级，2-查询一级+二级，3-查询一级+二级+三级
  return get('/mcweb/product/category_menu/yx/industry/list', payload)
}

/* 配置接口 */
export function setCategory (payload: any) {
  return newPost('/mcweb/dw/server/crm/subject/save', payload)
}

/* 获取配置接口 */
export function getCategory () {
  return get('/mcweb/dw/server/crm/subject/get')
}