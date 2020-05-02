/*
 * @Date: 2020-04-28 14:00:21
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-02 17:55:48
 * @FilePath: /supplier/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/merchant-accounts/checking/api.ts
 */
const { get, newPost } = APP.http
export const fetchList = (payload: any) => {
  return get('/mcweb/merchant/fresh/account/statement/list', payload)
}
export const fetchDetail = (payload: {id: any}) => {
  return get(`/mcweb/merchant/fresh/account/statement/${payload.id}`)
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
  return get('/mcweb/merchant/fresh/account/statement/export', payload)
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
  return get('/mcweb/merchant/fresh/account/statement/export/detail', payload)
}

/** 对账单详情明细导出 */
export const exportDetail = (id: any) => {
  return get(`/mcweb/merchant/fresh/account/statement/detail/export/${id}`)
}