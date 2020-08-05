/*
 * @Date: 2020-03-03 21:13:10
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-12 14:12:10
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/goods/api.js
 */
import { formResponse, formRequest } from './sku-sale/adapter'
import { exportFile, newGet } from '../../util/fetch'
import { omit } from 'lodash'
const { post, get, newPost } = APP.http
export function getStoreList (data, config) {
  return post('/store/list', data, config)
}

// 设置普通消费商品
export function setProduct (data) {
  console.log(data, 'setProduct')
  const isAdd = data.productId === -1
  const url = isAdd ? '/product/add' : '/product/update'
  data = formRequest(isAdd ? omit(data, ['productId']) : data)
  return post(url, {}, { data, headers: {} })
}

export const getGoodsList = APP.fn.wrapApi((data) => {
  return post('/product/list', data)
}, ['status'])

export function getGoodsDetial (data) {
  return post('/product/detail', data).then(formResponse)
}

export function delGoodsDisable (data) {
  return post('/product/disable', {}, { data, headers: {} })
}

export function enableGoods (data) {
  return post('/product/enable', {}, { data, headers: {} })
}

export function exportFileList (data) {
  return exportFile('/product/export', data)
}

export function getCategoryList () {
  return post('/category/treeCategory')
}

export function get1688Sku (storeProductId) {
  return get('/mcweb/product/b2b/detail', { storeProductId })
}

/** 运费模板列表 */
export function getTemplateList () {
  return post('/template/list')
}

/**
 * 获取待审核商品列表
 */
export function getToAuditList (data) {
  return newPost('/product/supplier/toAudit/list', data)
}

/**
 * 获取一级类目
 */
export function getCategoryTopList () {
  return post('/category/list', { level: 1 }).then((res) => {
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
export function auditGoods (data) {
  return newPost('/product/supplier/toAudit/audit', data)
}

/**
 * 获取定价策略列表
 */
export function getStrategyByCategory (data) {
  return newGet('/product/price/rule/getByCategoryId', data)
}
/**
 * 待审核详情
 */
export function toAuditDetail (data) {
  return get('/product/supplier/toAudit/get', data)
}
/**
 * 获取海淘商品库存信息
 */
export function getStockInfo (id) {
  return get(`/product/stock?skuId=${id}`)
}
/**
 * 商品复制
 */
export function copy (data) {
  return post('/mcweb/product/copy', data)
}