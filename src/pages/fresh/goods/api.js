/*
 * @Date: 2020-03-06 10:18:13
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-30 20:07:26
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/goods/api.js
 */

import { formResponse, formRequest } from './sku-sale/adapter';
import { exportFile, newGet } from '@/util/fetch';
import { omit } from 'lodash';
const { post, get, put, newPost, newPut } = APP.http;
export function getStoreList(data, config) {
  return post('/store/list', data, config);
}

export function getStoreFreshList(data, config) {
  return post('/store/fresh/list', data, config);
}

// 设置普通消费商品
export function setProduct(data) {
  const isAdd = data.productId === -1;
  const url = isAdd ? '/product/fresh/add' : '/product/fresh/update';
  data = formRequest(isAdd ? omit(data, ['productId']) : data);
  console.log(data, 'setProduct data');
  if (isAdd) {
    return post(url, {}, { data, headers: {} });
  } else {
    return newPut(url, {}, { data, headers: {} });
  }
}

// 商品列表
export function getGoodsList(data) {
  return get('/product/fresh/list', data);
}

// 商品详情
export function getGoodsDetial(data) {
  return get('/product/fresh/detail', data).then(formResponse);
}

export function delGoodsDisable(data) {
  return post('/product/fresh/disable', {}, { data, headers: {} });
}

export function enableGoods(data) {
  return post('/product/fresh/enable', {}, { data, headers: {} });
}

export function exportFileList(data) {
  return exportFile('/product/export', data);
}

export function getCategoryList() {
  return post('/category/treeCategory');
}

export function get1688Sku(storeProductId) {
  return get('/product/b2b/' + storeProductId);
}

/** 运费模板列表 */
export function getTemplateList() {
  return post('/template/list');
}

/**
 * 获取待审核商品列表
 */
export function getToAuditList(data) {
  return get(`/product/fresh/audit/list`, data);
}

/**
 * 获取一级类目
 */
export function getCategoryTopList() {
  return post('/category/list', { level: 1 }).then((res) => {
    return (res || []).map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  });
}

/**
 * 买菜商品-审核
 */
export function auditGoods(data) {
  return newPost('/product/fresh/audit', data);
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
  return get('/product/fresh/pool/detail', data);
}
/**
 * 获取海淘商品库存信息
 */
export function getStockInfo(id) {
  return get(`/product/stock?skuId=${id}`);
}

/**
 * 查看单个运费模板
 * @param freightTemplateId
 */
export function getDetail(freightTemplateId) {
  return get(`/template/${freightTemplateId}`);
}

/**
 * 置顶商品根据商品Id
 * @param {*} data
 */
export function upByGoodsId(data) {
  return put(`/mcweb/product/fresh/top`, data);
}

/**
 * 取消置顶商品根据商品Id
 * @param {*} data
 */
export function cancelUpByGoodsId(data) {
  return put(`/mcweb/product/fresh/top/cancel`, data);
}

/**
 * 自动上下架批次列表
 * @param {*} payload 
 */
export function getTimerList (payload) {
  return newGet('/mcweb/product/fresh/auto/config/list', payload)
}
/**
 * 新建自动上下架批次
 * @param {*} payload 
 */
export function addTimer (payload) {
  const form = new FormData()
    form.append('file', payload.file)
    form.append('type', payload.type)
    form.append('effectTime', payload.effectTime)
    form.append('batchName', payload.batchName)
  return post('/mcweb/product/fresh/auto/config/new', {}, {
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
/**
 * 开启自动上下架批次
 * @param {*} ids 
 */
export function openTimerById (ids) {
  return newPut('/mcweb/product/fresh/auto/config/open', {ids})
}
/**
 * 关闭自动上下架批次
 * @param {*} ids 
 */
export function closeTimerById (ids) {
  return newPut('/mcweb/product/fresh/auto/config/close', {ids})
}
