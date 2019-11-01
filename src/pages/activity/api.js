import { post, get } from '../../util/fetch';

export function getPromotionList(data) {
  return post('/promotion/list', data);
}

export function setBasePromotion(data) {
  return post('/promotion/addBasePromotion', {}, { data, headers: {} });
}
/**
 * 获取活动基本信息
 * @param {*} promotionId 
 */
export function getPromotionInfo(promotionId) {
  return get(`/promotion/${promotionId}`)
}
// 获取活动商品列表
export function getOperatorSpuList(data) {
  return get('/promotion/operatorSpuList', data);
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