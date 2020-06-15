/*
 * @Author: fangbao
 * @Date: 2020-05-15 20:07:20
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-15 20:32:35
 * @FilePath: /xt-crm/src/pages/banner/api.js
 */
// import { post } from '../../util/fetch';
const { post, newPost } = APP.http
const debug = false

const mockData = [
  {
    id: 0,
    imgUrlWap: 'string',
    jumpUrlWap: 'string',
    offlineDateTime: 'string',
    onlineDateTime: 'string',
    seat: 0,
    sort: 0,
    status: 0,
    title: 'string'
  }
]

export function queryBannerList (data) {
  console.log('queryBannerList- params', data, new Date())

  if (debug) {
    return Promise.resolve(mockData)
  }
  return post('/banner/fresh/list', data)
}

export function getBannerDetail (data) {
  console.log('getBannerDetail- params', data, new Date())
  if (debug) {
    return Promise.resolve({
      id: 0,
      imgUrlWap: 'string',
      jumpUrlWap: 'string',
      offlineDateTime: '',
      onlineDateTime: '',
      seat: 1,
      sort: 0,
      status: 0,
      title: 'string'
    })
  }
  return post('/banner/fresh/get', data)
}

export function addBanner (data) {
  console.log('addBanner- params', data, new Date())
  if (debug) {
    return Promise.resolve(true)
  }
  return post('/banner/fresh/add', data)
}

export function updateBanner (data) {
  console.log('updateBanner- params', data, new Date())
  if (debug) {
    return Promise.resolve(true)
  }
  return post('/banner/fresh/update', data)
}

export function deleteBanner (data) {
  console.log('deleteBanner- params', data, new Date())
  if (debug) {
    return Promise.resolve(true)
  }
  return post('/banner/fresh/delete', data)
}

export function updateBannerStatus (data) {
  console.log('updateBannerStatus- params', data, new Date())
  if (debug) {
    return Promise.resolve(true)
  }
  return post('/banner/fresh/update/status', data)
}
