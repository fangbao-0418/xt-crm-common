import { newPost, post, get } from '../../util/fetch';
import axios from 'axios';

// 失效优惠券
export function invalidCoupon() {

}
// 获取批量发送记录
export function getCouponTasks() {
  return axios('/api/coupon/tasklist')
}
// 获取优惠券详情
export function getCouponDetail(id) {
  return axios(`/api/coupon/detail/${id}`);
}

// 获取优惠券列表
export function getCouponlist(data) {
  return newPost('/coupon/get/couponList', data);
}

// 新增优惠券
export function saveCouponInfo(data) {
  return post('/coupon/save/couponInfo', data)
}

// 查询优惠券列表
export function getCouponList() {
    return get('/api/coupon/list')
  }
  
  export function getCategoryList() {
    return post('/category/treeCategory');
  }