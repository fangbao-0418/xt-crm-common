import { exportFile } from '@/util/fetch'
const { post, newPost, get } = APP.http

// 获取店长列表数据
export function getBossList (params) {
  return newPost('/shop/v1/apply/page', params)
}

// 查询用户
export function checkUser (params) {
  return post('/shop/v1/managers/check', params)
}

// 批量创建小店
export function createShop (params) {
  return post('/shop/v1/managers/create', params)
}

// 开通小店
export function openShop (params) {
  return newPost('/shop/v1/shop/open', params)
}

// 关闭小店
export function closeShop (params) {
  return newPost('/shop/v1/shop/close', params)
}

// 审核小店
export function auditShop (params) {
  return newPost('/shop/apply/v1/audit', params)
}

// 导出
export function batchExport (data) {
  return exportFile('/shop/export', data, '可开通小店情况表')
}

// 获取一级类目
export function getCategoryTopList () {
  return get('/mcweb/product/category/selectMainCategory').then((res) => {
    return (res || []).map((item) => {
      return {
        label: item.name,
        value: item.categoryId
      }
    })
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

// 导出在售商品id
export function shopExportProduct (data) {
  return exportFile('/shop/export/product', data, '在售商品')
}
