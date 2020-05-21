import * as Fetch from '@/util/fetch'

export function getList (params) {
  return Fetch.get('/mcweb/product/hotword/list', params)
}
export function saveInfo (params) {
  return Fetch.newPost('/mcweb/product/hotword/add', params)
}
export function deleteById (id) {
  return Fetch.del('/mcweb/product/hotword/delete?id='+id)
}
export function updateInfo (params) {
  return Fetch.newPut('/mcweb/product/hotword/update', params)
}
