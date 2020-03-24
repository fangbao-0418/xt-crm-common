import { post } from '@/util/fetch';

export function getStoreList(data) {
  return post('/store/list', data)
}

export function getFreshList(data) {
  return post('/store/fresh/list', data)
}