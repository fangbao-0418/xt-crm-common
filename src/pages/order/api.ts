import { post, exportFile, exportFileStream, get, put, newPut, newPost, fetch } from '@/util/fetch'
import { prefix } from '../../util/utils'
import { batchExportRequest } from './adapter'
const debug = false
const qs = require('qs')
export interface batchExportPayload {
  expressCompanyCode: string
  expressNumbers: string
  fileName: string
}

// 获取店铺类型
export function getShopTypes () {
  return get('/shop/v1/query/type').then((res: any) => {
    return (res || []).map((item: { tag: any; code: any }) => {
      return {
        label: item.tag,
        value: item.code
      }
    })
  })
}
// 供应商审核
export function replaceSupplier (payload: { refundOrderCode: string }) {
  return post('/order/afterSale/audit/replaceSupplier', payload)
}

// 获取订单类型集合
export function getOrderTypeList () {
  return get('/order/getOrderTypeList')
}

// 手机号查询店铺信息
export function getPhoneById (data: any) {
  return post('/shop/v1/query/one', data)
}
// 批量轨迹导出
export function batchExport (payload: batchExportPayload) {
  return exportFileStream('/expressTracking/batchExport', batchExportRequest(payload), payload.fileName)
}

// 获取快捷说明列表
export function getOrderRefundQuickReply () {
  return newPost('/order/afterSale/query/orderRefundQuickReply', {})
}

// 订单售后校验团长等级是否会降级
export function verifyDownDgrade (data: any) {
  return newPost('/order/afterSale/check/downHeadgrade', data)
}

export const getOrderList = APP.fn.wrapApi((data: any) => {
  return post('/order/list', data)
}, ['orderStatus'])

// 客服代申请售后单个商品详情
export function getProductDetail ({ mainOrderId, skuId }: any) {
  return get(`/order/afterSale/applyOrderSKuDetail/${mainOrderId}/${skuId}`)
}
// 获取售后原因
export function customerUpdate (data: any) {
  return newPut('/order/afterSale/customerUpdate', data)
}
// 获取售后原因
export function getRefundReason () {
  return get('/order/afterSale/getRefundReason')
}
// 重新退款
export function againRefund (id: number, info: any) {
  return post(`/order/afterSale/againRefund/${id}`, { info })
}

/**
 * 取消售后
 * @param skuServerId
 */
export function cancelRefund (skuServerId: number, info: string) {
  return post(`/order/afterSale/cancelRefund/${skuServerId}`, { info })
}

/**
 * 更新物流信息接口
 */
export function updateOrderExpress (data: any) {
  return post('/order/afterSale/updateOrderExpress', data)
}
/**
 * 完成订单
 * @param id
 * @param info
 */
export function closeOrder (id: number, info: any) {
  return post(`/order/afterSale/close/${id}`, { info })
}
/**
 * 确认收货
 * @param skuServerId
 */
export function confirmReceipt (skuServerId: number) {
  return newPost(`/order/afterSale/confirm/${skuServerId}`)
}
/**
 * 售后轨迹详情
 * @param skuServerId
 */
export function getSkuServerProcessDetailList (params: any) {
  const { id, orderCode } = params
  return get(`/order/afterSale/getSkuServerProcessDetailList/${id}?orderCode=${orderCode}`)
}
export function saveRefundInfo (data: any) {
  return post('/order/afterSale/saveRefundInfo', data)
}
export function queryOrderDetail (data: any) {
  return post('/order/detail', data)
}

export function push1688 (childOrderId: number) {
  return get('/order/push1688', { childOrderId })
}

export function withhold (childOrderId: number) {
  return get('/order/protocolPay', { childOrderId })
}

export function setOrderRemark (data: any) {
  if (debug) {
    return Promise.resolve(true)
  }
  return post('/order/saveInfo', data)
}

export function setRefundOrderRemark (data: any) {
  if (debug) {
    return Promise.resolve(true)
  }
  return post('/order/afterSale/saveRefundInfo', data)
}

export function deliveryOrder (data: any) {
  console.log('deliveryOrder', data)
  if (debug) {
    return Promise.resolve(true)
  }
  return post('/order/delivery', data)
}

export function deliveryChildOrder (data: any) {
  console.log('deliveryChildOrder', data)
  if (debug) {
    return Promise.resolve(true)
  }
  return post('/order/childDelivery', data)
}

export function updateLogisticsInfo (data: any) {
  return post('/order/updateOrderExpress', data)
}

export function addLogisticsInfo (data: any) {
  return post('/order/addOrderExpress', data)
}

export function getRefundOrderDetail (data: any) {
  return post('/order/afterSalesInfo', data)
}

export function refundOperate (data: any) {
  return newPost('/order/afterSale/auditOperate', data)
}

export function getStoreList (data: any) {
  return fetch('/store/list', {
    method: 'POST',
    data,
    /** 禁止日志 */
    banLog: true
  })
}
export function customerAdd (data: any) {
  return fetch('/order/afterSale/customerAdd', {
    method: 'POST',
    data
  })
}
export function customerAddCheck (data: any) {
  return fetch('/order/afterSale/check/downgrade', {
    method: 'POST',
    data
  })
}

export const refundList  = (data: any) => {
  const { page, pageSize, ...rest } = data
  const isEmptyArray = (v: any) => Array.isArray(v) && v.length === 0
  const isEmptyParams = Object.values(rest).every((v) => v == undefined || v === null || v === '' || isEmptyArray(v))
  if (isEmptyParams) {
    return Promise.resolve({
      code: "00000",
      data: {
        current: 1,
        pages: 0,
        records: [],
        searchCount: true,
        size: 10,
        total: 0
      },
      message: "成功",
      success: true
    });
  }
  return fetch('/order/afterSale/list', {
    method: 'POST',
    data
  })
}

export function refundDetail (params: any) {
  return fetch(`/order/afterSale/afterSalesInfo?${qs.stringify(params)}`)
}

export function newExportOrder (data: any) {
  if (APP.fn.checkEmptyParams(data, ['orderStatus'])) {
    return Promise.reject();
  }
  return APP.http.get('/order/export', {
    ...data,
    rangePicker: undefined,
    playPicker: undefined
  })
}

export function exportOrder (data: any) {
  return exportFile('/order/export', data)
}

export const importLogistics = prefix('/order/logistics/import')

export function getRefundOrderInfo (params: any) {
  return fetch(`/order/afterSalesInfo?${qs.stringify(params)}`)
}

export function refundAgain (data: any) {
  return post(`/order/afterSale/againRefund/${data.id}`)
}

export function closeRefund (data: any) {
  return post(`/order/afterSale/close/${data.id}`)
}

export const exportRefund = (data: any) => {
  return get('/order/afterSale/export', data)
}

export function profitRecal (data: any) {
  return fetch('/order/profit/recal', {
    method: 'POST',
    data
  })
}
export function profitRecycl (data: any) {
  return fetch('/order/profit/recycling', {
    method: 'POST',
    data
  })
}

/**
 * 根据订单号获取用户收益列表
 * @param {object} data
 */
export function getProceedsListByOrderId (param: any) {
  return get('/crm/member/settlement/v1/order/summary', param)
}

/**
 * 根据订单Id和会员Id获取用户收益列表
 * @param {object} data
 */
export function getProceedsListByOrderIdAndMemberId (param: any) {
  return get('/crm/member/settlement/v1/order/skuSummaryByMember', param)
}

/**
 * 根据订单Id和会员Id和SkuId获取用户收益列表
 * @param {object} data
 */
export function getProceedsListByOrderIdAndMemberIdAndSkuId (param: any) {
  return get('/crm/member/settlement/v1/detail', param)
}

/**
 * 根据订单Id和skuId获取用户收益列表
 * @param {object} data
 */
export function getProceedsListByOrderIdAndSkuId (param: any) {
  return get('/crm/member/settlement/v1/order/skuSummary', param)
}

/**
 * 取消订单拦截
 * @param {object}  param
 */
export function cancelIntercept (param: any) {
  return post('/order/intercept/cancelIntercept', param)
}

/**
 * 对拦截订单发货
 * @param {object}  param
 */
export function deliveryInterceptOrder (param: any) {
  return post('/order/intercept/interceptDeliver', param)
}

/**
 * 下单一小内修改收货地址
 * @param {object}  param
 */
export function modifyAddress (data: any) {
  return fetch('/order/updateContact', {
    method: 'POST',
    data,
    hideLoading: true
  })
}
//充值单列表
export function rechargeList (data: any) {
  return newPost('/mcweb/trade/orderRechargeDetail/list', data)
}
//充值单导出
export function rechargeExport (data: any) {
  return newPost('/mcweb/trade/orderRechargeDetail/export', data)
}

//补偿原因分级列表 入参orderBizType 订单业务类型: 0-喜团订单，10-买菜订单
export function getReasonList () {
  return get('/mcweb/sale-after/order/compensate/getReasonList', {
    orderBizType: 0
  })
}

//补偿责任归属列表 入参orderBizType 订单业务类型: 0-喜团订单，10-买菜订单
export function responsibilityList () {
  return get('/mcweb/sale-after/order/compensate/responsibilityList', {
    orderBizType: 0
  })
}

//客服角色补偿最大额度 入参orderBizType 订单业务类型: 0-喜团订单，10-买菜订单
export function getRoleAmount () {
  return get('/mcweb/sale-after/order/compensate/getRoleAmount', {
    orderBizType: 0
  })
}

//优惠券下拉列表 type：0-所有优惠券，1-补偿优惠券
export function couponList (data: any) {
  return newPost('/mcweb/sale-after/order/compensate/getCouponsByPage', data)
}

//优惠券所有优惠券
export function getCouponsAllList (data: any) {
  return get('/mcweb/sale-after/order/compensate/getCouponsAllList', data)
}

//获取用户微信账户
export function getUserWxAccount (data: any) {
  return get('/mcweb/sale-after/order/compensate/getUserWxAccount', data)
}

//发起补偿单申请
export function compensateApply (data:any) {
  return newPost('/mcweb/sale-after/order/compensate/apply', data)
}