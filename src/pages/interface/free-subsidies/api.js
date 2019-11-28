import * as Fetch from '@/util/fetch';

//查询所有类目
export function getFrontCategorys() {
  return Fetch.get('/category/menu/assist', {
    status: 0,
    pageNo: 1,
    pageSize: 20
  });
}

//查询单个类目
export function getCategory(id) {
  return Fetch.get('/category/menu/' + id);
}

//删除单个类目
export function delCategory(id) {
  return Fetch.del('/category/menu?categoryId=' + id);
}

//新建类目
export function saveFrontCategory(data) {
  return Fetch.post('/category/menu', {}, { data, headers: {} });
}

//编辑类目
export function updateFrontCategory(data) {
  return Fetch.put('/category/menu', {}, { data, headers: {} });
}
