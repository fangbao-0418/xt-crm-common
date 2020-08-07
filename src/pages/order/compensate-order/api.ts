const { post, newPost, get } = APP.http
import { exportFile } from '@/util/fetch'

/* 获取补偿订单列表 */
export function getOrderlist (data: any) {
  return newPost('/mcweb/sale-after/order/compensate/getCompensateList', {
    ...data,
    orderBizType: 0
  })
}

/* 获取补偿方式或补偿类型列表 */
export function getCompensatePayList () {
  /* orderBizType 订单业务类型 0-喜团订单，10-买菜订单 */
  return get('/mcweb/sale-after/order/compensate/compensatePayList', {
    orderBizType: 0
  })
}

/* 获取责任归属列表 */
export function getResponsibilityList () {
  /* orderBizType 订单业务类型 0-喜团订单，10-买菜订单 */
  return get('/mcweb/sale-after/order/compensate/responsibilityList', {
    orderBizType: 0
  })
}

/* 获取店铺列表 */
export function getSupplierList (data: any) {
  /* searchType 1. 店铺,2.供应商 */
  return newPost('/mmweb/supplier/shop/V1/search', data)
}

/* 补偿详情 */
export function getCompensateDetail (data: { compensateCode: string }) {
  return get('/mcweb/sale-after/order/compensate/getCompensateDetail', data)
}

/* 补偿单记录 */
export function getCompensateRecord (data: any) {
  return get('/mcweb/sale-after/order/compensate/getCompensateRecord', data)
}

/* 补偿单导出 */
export function exportCompensate (data: any) {
  return newPost('/mcweb/sale-after/order/compensate/exportCompensate', data)
}

/* 补偿单审核 */
export function auditCompensate (data: any) {
  // operateType操作类型 1 取消补偿单，2 拒绝，3-同意，4 重新发放
  return newPost('/mcweb/sale-after/order/compensate/auditCompensate', data)
}

//优惠券下拉列表 type：0-所有优惠券，1-补偿优惠券
export function couponList (data: any) {
  return newPost('/mcweb/sale-after/order/compensate/getCouponsByPage', data)
}

//获取用户微信账户
export function getUserWxAccount (data: any) {
  return get('/mcweb/sale-after/order/compensate/getUserWxAccount', data)
}

//使用优惠券
export function addCoupons (data: any) {
  return newPost('/mcweb/sale-after/order/compensate/addCoupons', data)
}