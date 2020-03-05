import { fetch } from '@/util/fetch';

// 类目列表
export function getList(data) {
  return fetch('/category/list', {
    method: 'POST',
    data
  })
}

// 添加类目
export function addCategory(data) {
  return fetch('/category/add', {
    method: 'POST',
    data
  })
}

// 编辑类目
export function editCategory(data) {
  return fetch('/category/update', {
    method: 'POST',
    data
  })
}

// 删除类目
export function delCategory(data) {
  return fetch('/category/delete', {
    method: 'POST',
    data
  })
}