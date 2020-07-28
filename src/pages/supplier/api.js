/*
 * @Date: 2020-03-24 10:28:23
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-26 18:17:07
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/supplier/api.js
 */
import { exportFile } from '../../util/fetch'
import { queryString } from '@/util/utils'
const { post, newPost, get } = APP.http
const debug = false

const mockData = {
  current: 0,
  pages: 0,
  records: [
    {
      code: 'string',
      contacts: 'string',
      email: 'string',
      id: 0,
      name: 'string',
      phone: 'string',
      shortName: 'string'
    }
  ],
  searchCount: true,
  size: 0,
  total: 0
}

// 新增供应商账号
export function addSupplierAccount (data) {
  return post('/store/add/supplier', data)
}

// 保证金缴纳方式
export function depositTypes () {
  return get('/store/depositTypes').then((res) => {
    return res&&res.list&&res.list.map((record) => {
      return {
        value: record.key,
        label: record.value
      }
    })
  })
}

// 重置供应商账号
export function resetStore (data) {
  return post('/store/reset', data)
}
export function querySupplierList (data) {
  console.log('querySupplierList- params', data, new Date())
  if (debug) {
    return Promise.resolve(mockData)
  }
  return post('/store/list', data, {
    /** 禁止日志 */
    banLog: true
  })
}

export function getSupplierDetail (data) {
  console.log('getSupplierDetail- params', data, new Date())
  if (debug) {
    return Promise.resolve({
      address: 'string',
      code: 'string',
      consigneeAddress: 'string',
      contacts: 'string',
      email: 'string',
      id: 0,
      jumpUrl: 'string',
      name: 'string',
      phone: 'string',
      shortName: 'string'
    })
  }
  return get(`/store/detail${queryString(data)}`)
}

export function addSupplier (data) {
  console.log('addSupplier- params', data, new Date())
  if (debug) {
    return Promise.resolve(true)
  }
  return newPost('/store/add', data)
}

export function updateSupplier (data) {
  console.log('updateSupplier- params', data, new Date())
  if (debug) {
    return Promise.resolve(true)
  }
  return newPost('/store/update', data)
}

export function exportSupplier (data) {
  console.log('exportSupplier- params', data, new Date())
  if (debug) {
    return Promise.resolve(true)
  }
  return exportFile('/store/export', data)
}
