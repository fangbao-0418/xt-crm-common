const { get, del, post, put } = APP.http;

//提现记录
export function getFrontCategorys() {
  return get('/category/menu/fresh', {
    status: 0,
    page: 1,
    pageSize: 20
  });
}

export function getCategory(id) {
  return get('/category/menu/' + id);
}
export function delCategory(id) {
  return del('/category/menu?categoryId=' + id);
}

export function getCategorys(id) {
  return get('/category/getCategoryList/' + (id || 0));
}
/**
 * 
  {
    name: "string",
    productCategoryVOS: [
      {
        "id": 0,
        "name": "string",
        "type": 0
      }
    ],
    sort: 0
  }
 */
export function saveFrontCategory(data) {
  return post('/category/menu', {}, { data, headers: {} });
}

export function updateFrontCategory(data) {
  return put('/category/menu', {}, { data, headers: {} });
}
