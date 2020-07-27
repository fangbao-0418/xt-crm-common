const { get } = APP.http

export function fetchCategory (payload: any) {
  // level 1-只查一级，2-查询一级+二级，3-查询一级+二级+三级
  return get('/mcweb/product/category_menu/yx/industry/list', payload)
}