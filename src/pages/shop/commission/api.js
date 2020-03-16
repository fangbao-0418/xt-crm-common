// import { fetch } from '@/util/fetch';
const { get, newPost, newPut } = APP.http

// 类目列表
export function getList(data) {
  return newPost('/category/commission/list', data)
}

// 获取类目详情
export function getDetai(data) {
  return get('/category/commission/detail', data)
}

// 编辑类目
export function editCategory(data) {
  return newPut('/category/commission/update', data)
}