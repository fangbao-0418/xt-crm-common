/*
 * @Date: 2020-04-28 14:00:21
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-03 20:40:21
 * @FilePath: /xt-crm/src/pages/fresh/merchant-accounts/checking/api.ts
 */
const { get, newPost } = APP.http
export const fetchList = (payload: any) => {
  return get('::guard/mcweb/merchant/fresh/account/statement/list', payload)
}

/** 获取对账单明细信息 */
export const fetchDetail = (payload: {id: any}) => {
  return get(`::guard/mcweb/merchant/fresh/account/statement/${payload.id}`)
}

/** 获取对账单商品明细列表 */
export const fetchDetailShopList = (payload: {
  id: any
  page: number
  pageSize: number
}) => {
  return get(`::guard/mcweb/merchant/fresh/account/statement/detail/${payload.id}`, {
    ...payload,
    id: undefined
  })
}

export const batchExport = (payload: {
  page?: number
  pageSize?: number
  serialNo?: string
  supplierId?: number
  supplierName?: string
  productId?: number
  year?: number
  month?: number
}) => {
  return get('::guard/mcweb/merchant/fresh/account/statement/export', payload)
}

export const batchExportDetail = (payload: {
  page?: number
  pageSize?: number
  serialNo?: string
  supplierId?: number
  supplierName?: string
  productId?: number
  year?: number
  month?: number
}) => {
  return get('::guard/mcweb/merchant/fresh/account/statement/export/detail', payload)
}

/** 对账单详情明细导出 */
export const exportDetail = (id: any) => {
  return get(`::guard/mcweb/merchant/fresh/account/statement/detail/export/${id}`)
}

/** 对账单流水明细导出 */
export const exportRunningWaterDetail = (id: any) => {
  return get(`::guard/mmweb/supplier/finance/account/statement/detail/flow/export?statementId=${id}`)
}