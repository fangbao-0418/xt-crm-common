import * as Fetch from '@/util/fetch'

export function getList (params) {
  return Fetch.get('/product/hotword/list', params)
}
export function saveInfo (params) {
  return Fetch.newPost('/product/hotword/add', params)
}
export function deleteById (id) {
  return Fetch.del('/mcweb/product/hotword/delete', { id })
}
export function updateInfo (params) {
  return Fetch.newPut('/product/hotword/update', params)
}
