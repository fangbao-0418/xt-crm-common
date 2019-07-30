import * as Fetch from '@/util/fetch';
//提现记录
export function getFrontCategorys() {
  return Fetch.get('/category/menu', {
    status: 0,
    pageNo: 1,
    pageSize: 20
  });
}

export function getCategory(id) {
  return Fetch.get('/category/menu/' + id);
}
export function delCategory(id) {
  return Fetch.del('/category/menu?categoryId=' + id);
}

export function getCategorys(id) {
  return Fetch.get('/category/getCategoryList/' + (id || 0));
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
  return Fetch.post('/category/menu', {}, { data, headers: {} });
}

export function updateFrontCategory(data) {
  return Fetch.put('/category/menu', {}, { data, headers: {} });
}
