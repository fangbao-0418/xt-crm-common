import { newPost, newGet, newPut, post, get } from '../../util/fetch';

export function modifyCouponBaseInfo(data) {
  return newPut('/coupon/modify/couponBaseInfo', data);
}

// 新增发券信息
export function saveCouponTaskInfo(data) {
  return newPost('/coupon/save/saveCouponTaskInfo', data);
}

// 结束领取优惠券
export function overReciveCoupon(couponId) {
  return newPut(`/coupon/modify/overReciveCoupon/${couponId}`)
}

// 停止发券
export function stopCouponTask(taskId) {
  return newPut(`/coupon/modify/stopCouponTask/${taskId}`)
}

// 失效任务优化券
export function invalidTaskCoupon(taskId, couponId) {
  return newPut(`/coupon/modify/invalidTaskCoupon/${taskId}/${couponId}`)
}
// 失效优惠券
export function invalidCoupon(couponId) {
  return newPut(`/coupon/modify/invalidCoupon/${couponId}`)
}
// 获取批量发送记录
export function getCouponTasks(couponId) {
  return newGet(`/coupon/get/couponTaskList/${couponId}`)
}
// 获取优惠券详情
export function getCouponDetail(id) {
  return newGet(`/coupon/get/couponDetail/${id}`);
}

// 获取优惠券列表
export function getCouponlist(data) {
  return newPost('/coupon/get/couponList', data);
}

// 新增优惠券
export function saveCouponInfo(data) {
  return newPost('/coupon/save/couponInfo', data)
}

// 查询优惠券列表
export function getCouponList() {
  return get('/api/coupon/list')
}

export function getCategoryList() {
  return post('/category/treeCategory');
}