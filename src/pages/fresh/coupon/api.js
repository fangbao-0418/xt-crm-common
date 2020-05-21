/*
 * @Author: fangbao
 * @Date: 2020-04-13 22:45:07
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-15 15:40:16
 * @FilePath: /supplier/Users/fangbao/Documents/xituan/xt-crm/src/pages/coupon/api.js
 */
import { newPost, newGet, newPut, get } from '../../../util/fetch'
const { post } = APP.http
import * as adapter from './adapter'

export function importShop () {
  const el = document.createElement('input')
  el.setAttribute('type', 'file')
  return new Promise((resolve, reject) => {
    el.onchange = function (e) {
      const file = e.target.files[0]
      console.log(file, 'file')
      const form = new FormData()
      form.append('file', file)
      post('/promotion/fresh/product/check', {}, {
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        resolve(res)
      }, (err) => {
        reject(err)
      })
    }
    el.click()
  })
}

export function modifyCouponBaseInfo (data) {
  return newPut('/mcweb/coupon/fresh/modify/couponInfo', data)
}

// 新增发券信息
export function saveCouponTaskInfo (data) {
  return newPost('/mcweb/coupon/fresh/save/saveCouponTaskInfo', data)
}

// 结束领取优惠券
export function overReciveCoupon (couponId) {
  return newPut(`/mcweb/coupon/fresh/modify/overReciveCoupon?couponId=${couponId}`)
}

// 停止发券
export function stopCouponTask (taskId) {
  return newPut(`/mcweb/coupon/fresh/modify/stopCouponTask?taskId=${taskId}`)
}

// 失效任务优化券
export function invalidTaskCoupon (taskId, couponId) {
  return newPut(`/mcweb/coupon/fresh/modify/invalidTaskCoupon?taskId=${taskId}&couponId=${couponId}`)
}
// 失效优惠券
export function invalidCoupon (couponId) {
  return newPut(`/mcweb/coupon/fresh/modify/invalidCoupon?couponId=${couponId}`)
}
// 获取批量发送记录
export function getCouponTasks (couponId) {
  return newGet(`/mcweb/coupon/fresh/get/couponTaskList?couponId=${couponId}`)
}
// 获取优惠券详情
export function getCouponDetail (id) {
  return newGet(`/mcweb/coupon/fresh/get/couponDetail?couponId=${id}`)
}

// 获取优惠券列表
export function getCouponlist (data) {
  return newPost('/mcweb/coupon/fresh/get/couponList', data)
}

// 新增优惠券
export function saveCouponInfo (data) {
  const params = adapter.couponDetailParams(data)
  return newPost('/mcweb/coupon/fresh/save/couponInfo', params)
}

// 查询优惠券列表
export function getCouponList () {
  return get('/api/coupon/list')
}

export function getCategoryList () {
  return post('/category/treeCategory')
}