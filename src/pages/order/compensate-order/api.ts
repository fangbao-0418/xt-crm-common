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
  return newPost('/crm/order/compensate/getCompensateRecord', data)
}

/* 补偿单导出 */
export function exportCompensate (data: any) {
  return newPost('/mcweb/sale-after/order/compensate/exportCompensate', data)
}