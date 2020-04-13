import { newPost, newGet, newPut, post, get } from '../../util/fetch'
import * as adapter from './adapter'

export function importShop () {
  const el = document.createElement('input')
  el.setAttribute('type', 'file')
  el.onchange = function (e) {
    const file = e.target.files[0]
    console.log(file, 'file')
    post('/promotion/product/check', {}, {
      data: {
        file,
        a: 2,
        b: 4
      },
      headers: {
        'Content-Type': false
      }
    })
  }
  el.click()
  // return newPost('/promotion/product/check', {

  // })
}

export function modifyCouponBaseInfo (data) {
  return newPut('/coupon/modify/couponInfo', data)
}

// 新增发券信息
export function saveCouponTaskInfo (data) {
  return newPost('/coupon/save/saveCouponTaskInfo', data)
}

// 结束领取优惠券
export function overReciveCoupon (couponId) {
  return newPut(`/coupon/modify/overReciveCoupon/${couponId}`)
}

// 停止发券
export function stopCouponTask (taskId) {
  return newPut(`/coupon/modify/stopCouponTask/${taskId}`)
}

// 失效任务优化券
export function invalidTaskCoupon (taskId, couponId) {
  return newPut(`/coupon/modify/invalidTaskCoupon/${taskId}/${couponId}`)
}
// 失效优惠券
export function invalidCoupon (couponId) {
  return newPut(`/coupon/modify/invalidCoupon/${couponId}`)
}
// 获取批量发送记录
export function getCouponTasks (couponId) {
  return newGet(`/coupon/get/couponTaskList/${couponId}`)
}
// 获取优惠券详情
export function getCouponDetail (id) {
  return newGet(`/coupon/get/couponDetail/${id}`)
}

// 获取优惠券列表
export function getCouponlist (data) {
  return newPost('/coupon/get/couponList', data)
}

// 新增优惠券
export function saveCouponInfo (data) {
  const params = adapter.couponDetailParams(data)
  return newPost('/coupon/save/couponInfo', params)
}

// 查询优惠券列表
export function getCouponList () {
  return get('/api/coupon/list')
}

export function getCategoryList () {
  return post('/category/treeCategory')
}