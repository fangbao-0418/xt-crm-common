const { get, del, post, put } = APP.http

/** 查询前台一级类目列表 */
export function getFrontCategorys (channel) {
  return get('/mcweb/product/category_menu/list', {
    status: 0,
    pageNo: 1,
    pageSize: 20,
    channel
  })
}

export function getCategory (categoryMenuId) {
  return get('/mcweb/product/category_menu/detail', { categoryMenuId })
}
export function delCategory (categoryId) {
  return del('/mcweb/product/category_menu/delete', { categoryId })
}

export function getCategorys (id) {
  return get('/mcweb/product/category/getCategoryList?parentId=' + (id || 0))
}

export function saveFrontCategory (data) {
  return post('/mcweb/product/category_menu/add', {}, { data, headers: {} })
}

export function updateFrontCategory (data) {
  return put('/mcweb/product/category_menu/update', {}, { data, headers: {} })
}

/** POP主营类目列表 */
export function getPopList () {
  return get('/mcweb/product/category/pop/list')
}