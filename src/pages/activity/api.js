import { post, get } from '../../util/fetch';

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

/************** 抽奖接口 start***************/


// 用户抽奖码列表
export function getLotteryList(data) {
  return post('/lottery/list', data)
}
// 抽奖码失效 data:[]
export function lotteryDisable(data) {
  return post('/lottery/disable', data)
}
// 抽奖券码生效 data:[]
export function lotteryEnable(data) {
  return post('/lottery/enable', data)
}
// 手工发码 data:[]
export function lotteryManualGive(data) {
  return post('/lottery/manualGive', data)
}

/************** 抽奖接口 end***************/