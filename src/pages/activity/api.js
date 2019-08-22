import { post, get } from '../../util/fetch';
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
  return post('/coupon/get/couponList', data);
}

// 新增优惠券
export function saveCouponInfo(data) {
  return post('/coupon/save/couponInfo', data)
}
export function getPromotionList(data) {
  return post('/promotion/list', data);
}

export function setBasePromotion(data) {
  return post('/promotion/addBasePromotion', {}, { data, headers: {} });
}

// 设置活动商品列表
export function setPromotionOperatorSpuList(data) {
  return post('/promotion/operatorSpuList', data);
}

// 查看活动详情
export function getPromotionDetail(data) {
  return post('/promotion/detail', data);
}

// 添加活动商品
export function setPromotionAddSpu(data) {
  return post('/promotion/addSpu', {}, { data, headers: {} });
}

// 保存sku
export function setPromotionAddSKu(data) {
  return post('/promotion/addSku', {}, { data, headers: {} });
}

export function getProductList(data) {
  return post('/product/list', data);
}

export function disablePromotion(data) {
  return post('/promotion/disable', {}, { data, headers: {} });
}

export function enablePromotion(data) {
  return post('/promotion/enable', {}, { data, headers: {} });
}

export function updateBasePromotion(data) {
  return post('/promotion/updateBasePromotion', {}, { data, headers: {} });
}

export function delSpuPromotion(data) {
  return post('/promotion/deleteSpu', data);
}

export function refreshPromtion(promotionId) {
  return get('/promotion/refreshPromtion', { promotionId })
}

// 查询优惠券列表
export function getCouponList() {
  return get('/api/coupon/list')
}

export function getCategoryList() {
  return post('/category/treeCategory');
}