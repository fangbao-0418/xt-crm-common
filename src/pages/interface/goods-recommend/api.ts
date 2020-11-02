import { Item } from './index'
import * as adapter from './adapter'
const { get, newPost, newPut } = APP.http
export const fetchList = (payload: {
  createStartTime: number
  createEndTime: number
  location: number
  name: string
  pageNo: number
  pageSize: number
  status: number
}) => {
  return newPost('/product/recommend/list', payload)
}

export const add = (payload: Item) => {
  return newPost('/product/recommend/add', payload)
}

export const update = (payload: Item) => {
  return newPut('/product/recommend/update', payload)
}

export const fetchGoodsList = (
  payload: any
) => {
  payload = {
    ...payload,
    pageNo: payload.pageNo !== undefined ? payload.pageNo : payload.page,
    page: undefined
  }
  return get('/product/recommend/queryProductList', payload)
}

export const fetchDetail = (id: any) => {
  return get('/mcweb/product/recommend/detail', { id }).then(adapter.recommend)
}

export const disabled = (id: any) => {
  return newPut('/mcweb/product/recommend/disable', { id })
}