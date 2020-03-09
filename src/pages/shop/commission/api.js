// import { fetch } from '@/util/fetch';
import { list, detail, update } from './mock'

// 类目列表
export function getList(data) {
  console.log('todo getList 入参', data)
  return new Promise((r) => {
    r(list)
  })
  // return fetch('/category/list', {
  //   method: 'POST',
  //   data
  // })
}

// 获取类目详情
export function getDetai(data) {
  console.log('todo getDetai 入参', data)
  return new Promise((r) => {
    r(detail.data)
  })
  // return fetch('/categoryCommission/detail', {
  //   method: 'POST',
  //   data
  // })
}

// 编辑类目
export function editCategory(data) {
  console.log('todo editCategory 入参', data)
  return new Promise((r) => {
    r(update.success)
  })
  // return fetch('/categoryCommission/update', {
  //   method: 'put',
  //   data
  // })
}