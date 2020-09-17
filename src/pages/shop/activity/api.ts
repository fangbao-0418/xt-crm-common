import { exportFileStream } from '@/util/fetch'
import * as adapter from './adapter'

const { get, post, newPost } = APP.http

/** 0-全部/1-待发布/2-已发布/3-报名中/4-预热中/5-进行中/6-已结束/7-已关闭 */
export type StatusType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
interface PromotionPayload {
  venueId?: number,
  title: string,
  type: number,
  description: string,
  applyStartTime: number,
  applyEndTime: number,
  preheat: 0 | 1,
  startTime: number,
  endTime: number,
  costPriceDiscount: number,
  dataSource: any[]
}

/** 会场活动列表 */
export function getPromotionList (payload: {
  title?: string,
  status?: StatusType,
  startTime?: number,
  endTime?: number,
  promotionId?: string,
  shopId?: string,
  shopName?: string,
  page: number,
  pageSize: number
}) {
  return get('/mcweb/product/promotion/venue/list', payload)
}

/** 设置会场排序 */
export function setSort (payload: {
  promotionId: number,
  sort: number
}) {
  return newPost('/mcweb/product/promotion/venue/setSort', payload)
}

/** 新建会场活动 */
export function addPromotion (payload: PromotionPayload) {
  return newPost('/mcweb/product/promotion/venue/add', adapter.requestPromotion(payload))
}

/** 编辑会场活动 */
export function updatePromotion (payload: PromotionPayload) {
  return newPost('/mcweb/product/promotion/venue/update', adapter.requestPromotion(payload))
}

/** 会场活动详情 */
export function getPromotionDetail (promotionId: string) {
  return get(`/mcweb/product/promotion/venue/detail?promotionId=${promotionId}`).then(adapter.responseDetail)
}

/** 会场活动商品sku审核 */
export function auditSku (payload: {
  promotionId: string,
  skuId: number,
  auditStatus: 0 | 1 | 2
}) {
  return newPost('/mcweb/product/promotion/venue/auditSku', payload)
}

/** 导出会场商品 */
export function exportVenue (promotionId: string) {
  const data = { promotionId }
  return exportFileStream('/mcweb/product/promotion/venue/export', data, '会场商品信息.xlsx', {
    method: 'get',
    data: undefined,
    params: data
  })
}

/** 会场活动导入商品审核 */
export function importAuditSku (payload: {
  file: any,
  promotionId: string
}) {
  const form = new FormData()
  form.append('file', payload.file)
  form.append('promotionId', payload.promotionId)
  return post('/mcweb/product/promotion/venue/import/auditSku', {}, {
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 会场活动商品列表
 * 审核状态（-1-所有，0-待审核，1-审核通过，2-审核拒绝）
 */
export function getPromotionProduct (payload: {
  promotionId: string,
  status: string,
  productId?: number,
  productName?: string,
  page: number,
  pageSize: number
}) {
  return get('/mcweb/product/promotion/venue/products', payload)
}

/** 发布会场活动 */
export function publishPromotion (venueId: number) {
  return newPost(`/mcweb/product/promotion/venue/publish?venueId=${venueId}`)
}

/** 会场活动关闭 */
export function closePromotion (promotionId: number) {
  return newPost(`/mcweb/product/promotion/venue/close?promotionId=${promotionId}`)
}

/**
 * 店铺列表
 * payload.bizType 0:优选,1:好店 默认前段选1 号店
 * payload.shopName 店铺名称
 * payload.shopId shopId
 * payload.page 当前页
 * payload.pageSize 每页长度
 */
export function getShopList (payload: {
  bizType?: number,
  shopName?: string,
  shopId?: string,
  shopStatusList?: number[],
  page: number,
  pageSize: number
}) {
  return newPost('/mmweb/pop/query/base/ps/v1', payload)
}