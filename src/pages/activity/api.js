import { post, get, newPost } from '../../util/fetch'
import { promotionParams, promotionResponse } from './adapter'

export function getPromotionList (data) {
  return post('/promotion/list', data)
}

export function setBasePromotion (data) {
  return post('/promotion/addBasePromotion', {}, {
    data: promotionParams(data),
    headers: {}
  })
}

// 获取店铺类型
export function getShopTypes () {
  return get('/shop/v1/query/type').then((res) => {
    return (res || []).map((item) => {
      return {
        label: item.tag,
        value: item.code
      }
    })
  })
}

/**
 * 获取活动基本信息
 * @param {*} promotionId
 */
export function getPromotionInfo (promotionId) {
  return get(`/mcweb/promotion/getById?promotionId=${promotionId}`).then(promotionResponse)
}

// 获取活动商品列表
export function getOperatorSpuList (data) {
  return get('/promotion/operatorSpuList', data)
}

// 查看活动详情
export function getPromotionDetail (data) {
  return post('/promotion/detail', data)
}

// 添加活动商品
export function setPromotionAddSpu (data) {
  return post('/promotion/addSpu', {}, { data, headers: {} })
}

// 保存sku
export function setPromotionAddSKu (data) {
  return post('/promotion/addSku', {}, { data, headers: {} })
}

export function getProductList (data) {
  return post('/product/list', data)
}

export function disablePromotion (data) {
  return post('/promotion/disable', {}, { data, headers: {} })
}

export function enablePromotion (data) {
  return post('/promotion/enable', {}, { data, headers: {} })
}

export function updateBasePromotion (data) {
  return post('/promotion/updateBasePromotion', {}, {
    data: promotionParams(data),
    headers: {}
  })
}

export function delSpuPromotion (data) {
  return post('/promotion/deleteSpu', data)
}

export function refreshPromtion (promotionId) {
  return get('/promotion/refreshPromtion', { promotionId })
}

/************** 抽奖接口 start***************/
// 用户抽奖码列表
export function getLotteryList (data) {
  return get('/lottery/list', data)
}

// 抽奖码失效 String[] ticketCodes; 奖券码集合
// String  failureReason;失效原因
export function lotteryDisable (data) {
  return newPost('/lottery/disable', data)
}

// 抽奖券码生效 String[] ticketCodes; 奖券码集合
export function lotteryEnable (data) {
  return newPost('/lottery/enable', data)
}

// 手工发码 lotteryMemberTicketManualAddVOList:[]
export function lotteryManualGive (data) {
  return newPost('/lottery/manualGive', data)
}
/************** 抽奖接口 end***************/

/**
 * 获取活动下所有商品
 * @param {*} param
 */
export function getGoodsListByActivityId ({ promotionId, ...data }) {
  return get(`/mcweb/promotion/products/byPromotionId?promotionId=${promotionId}`, data)
}

/**
 * 商品批量转移到另一个活动
 * @param {*} param
 */
export function batchMoveGoodsToOtherActivity (param) {
  return newPost('/promotion/batchmove', param)
}
