import { newPost, get, newPut } from '@/util/fetch';

/** 获取商品详情信息 */
export function getGoodsInfo(data) {
  return get('/shop/product/detail', data);
}

/** 获取运费模板信息 */
export function getFreightTemplate(id) {
  return get(`/template/${id}`);
}

/** 审核商品 */
export function auditGoods(data) {
  return newPost('/shop/product/audit', {
    ...data,
    /** requestType 1-小店（不校验channel） 2-pop */
    requestType: 2
  });
}

/** 修改商品 */
/**
 * 
 * @param {object} payload 
 * @param {number} payload.productPoolId - 商品池id
 * @param {Object[]} payload.productPoolSkuCommissionUpdateDTOList - 商品sku记录信息
 * @param {number} payload.productPoolSkuCommissionUpdateDTOList[].commissionIncreasePrice - 上浮金额（分）
 * @param {number} payload.productPoolSkuCommissionUpdateDTOList[].productPoolSkuId - 商品池skuid
 */
export function updateGoods (payload) {
  return newPut('/mcweb/product/shop/pop/update', {
    productPoolId: payload.productPoolId,
    productPoolSkuCommissionUpdateDTOList: payload.productPoolSkuCommissionUpdateDTOList
  })
}
