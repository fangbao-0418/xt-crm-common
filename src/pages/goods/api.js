import { post, exportFile, get, newGet, newPost } from '../../util/fetch';

export function getStoreList(data, config) {
  return post('/store/list', data, config);
}

export function setProduct(data) {
  const url = data.productId ? '/product/update' : '/product/add';
  return post(url, {}, { data, headers: {} });
}

export function getGoodsList(data) {
  return post('/product/list', data);
}

export function getGoodsDetial(data) {
  return post('/product/detail', data);
}

export function delGoodsDisable(data) {
  return post('/product/disable', {}, { data, headers: {} });
}

export function enableGoods(data) {
  return post('/product/enable', {}, { data, headers: {} });
}

export function exportFileList(data) {
  return exportFile('/product/export', data);
}

export function getCategoryList() {
  return post('/category/treeCategory');
}

export function get1688Sku(storeProductId) {
  return get('/product/b2b/'+storeProductId);
}

/** 运费模板列表 */
export function getTemplateList() {
  return post('/template/list')
}

/**
 * 获取待审核商品列表
 */
export function getToAuditList(data) {
  return newPost(`/product/supplier/toAudit/list`, data)
}

/**
 * 获取一级类目
 */
export function getCategoryTopList () {
  return post('/category/list', { level: 1}).then((res) => {
    return (res || []).map((item) => {
      return {
        label: item.name,
        value: item.id
      }
    })
  })
}

/**
 * 审核商品
 */
export function auditGoods(data) {
  return newPost('/product/supplier/toAudit/audit', data)
}

/**
 * 获取定价策略列表
 */
export function getStrategyByCategory(data) {
  return newGet('/product/price/rule/getByCategoryId', data);
}
/**
 * 待审核详情 
 */
export function toAuditDetail(data) {
  return get('/product/supplier/toAudit/get', data)
}
/**
 * 获取海淘商品库存信息
 */
export function getStockInfo (id) {
  return get(`/product/stock?skuId=${id}`)
}