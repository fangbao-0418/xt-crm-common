import { formResponse, formRequest } from './sku-sale/adapter';
import { exportFile, newGet } from '@/util/fetch';
import { omit } from 'lodash';
const { post, get, newPost } = APP.http; 
export function getStoreList(data, config) {
  return post('/store/list', data, config);
}

// 设置普通消费商品
export function setProduct(data) {
  const isAdd = data.productId === -1
  const url = isAdd ? '/product/add' : '/product/update';
  data = formRequest(isAdd ? omit(data, ['productId']) : data);
  return post(url, {}, { data, headers: {} });
}

// 商品列表
export function getGoodsList(data) {
  return post('/product/list', data);
  // return post('/product/fresh/list', data);
}

// 商品详情
export function getGoodsDetial(data) {
  return post('/product/fresh/detail', data).then(formResponse);
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
  return newPost(`/product/fresh/audit/list`, data)
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
 * 买菜商品-审核
 */
export function auditGoods(data) {
  return newPost('/product/fresh/audit', data)
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